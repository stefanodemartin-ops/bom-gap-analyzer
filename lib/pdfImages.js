import * as mupdf from "mupdf";

// Claude's PDF ingestion renders pages capped at ~1568px on the long edge.
// Scanned engineering drawings (D/E-size sheets, no text layer) become
// illegible at that size, so we detect them and send high-resolution image
// tiles instead. Text-bearing PDFs keep the original document-block path.

const TARGET_LONG_EDGE = 4400; // px — matches typical drawing scan resolution
const TILE = 1024;             // px — under the API's no-downscale threshold
const OVERLAP = 120;           // px — so table rows/callouts aren't cut at seams
const OVERVIEW_LONG_EDGE = 1092; // px — whole-page context image, ~1MP
const MIN_TEXT_CHARS = 200;    // per document: below this, treat as scanned
const MAX_TILED_PAGES = 6;     // cost/latency cap for multi-page scans

function pngImageBlock(pngBytes) {
  return {
    type: "image",
    source: {
      type: "base64",
      media_type: "image/png",
      data: Buffer.from(pngBytes).toString("base64"),
    },
  };
}

function renderRegion(page, zoom, bbox) {
  const pix = new mupdf.Pixmap(mupdf.ColorSpace.DeviceRGB, bbox, false);
  pix.clear(255);
  const dev = new mupdf.DrawDevice(mupdf.Matrix.scale(zoom, zoom), pix);
  page.run(dev, mupdf.Matrix.identity);
  dev.close();
  const png = pix.asPNG();
  pix.destroy();
  return png;
}

function documentBlock(buffer, title) {
  return {
    type: "document",
    source: {
      type: "base64",
      media_type: "application/pdf",
      data: buffer.toString("base64"),
    },
    title,
  };
}

// Returns an array of content blocks for one uploaded OEM file: either the
// original PDF document block (text-bearing PDF) or labeled high-res tiles
// (scanned PDF). Falls back to the document block if anything goes wrong.
export function buildOemBlocks(buffer, title) {
  let doc;
  try {
    doc = mupdf.Document.openDocument(buffer, "application/pdf");
  } catch {
    return [documentBlock(buffer, title)];
  }

  try {
    const pageCount = doc.countPages();

    let textChars = 0;
    for (let i = 0; i < pageCount; i++) {
      textChars += doc.loadPage(i).toStructuredText().asText().trim().length;
      if (textChars >= MIN_TEXT_CHARS) break;
    }
    if (textChars >= MIN_TEXT_CHARS) {
      return [documentBlock(buffer, title)];
    }

    const blocks = [
      {
        type: "text",
        text:
          `${title} — this is a SCANNED document with no text layer, provided as high-resolution image tiles. ` +
          `For each page you get a small overview image of the whole page, followed by a grid of overlapping ` +
          `high-resolution tiles (labeled by row/column, row 1 col 1 = top-left). Adjacent tiles overlap, so ` +
          `content near an edge also appears in the neighboring tile — use whichever copy is more complete, ` +
          `and do not double-count parts that appear in two tiles.`,
      },
    ];

    const pagesToTile = Math.min(pageCount, MAX_TILED_PAGES);
    for (let p = 0; p < pagesToTile; p++) {
      const page = doc.loadPage(p);
      const [x0, y0, x1, y1] = page.getBounds();
      const wPt = x1 - x0;
      const hPt = y1 - y0;

      const overviewZoom = OVERVIEW_LONG_EDGE / Math.max(wPt, hPt);
      blocks.push({ type: "text", text: `Page ${p + 1} of ${pageCount} — full-page overview:` });
      blocks.push(
        pngImageBlock(
          renderRegion(page, overviewZoom, [0, 0, Math.round(wPt * overviewZoom), Math.round(hPt * overviewZoom)])
        )
      );

      const zoom = TARGET_LONG_EDGE / Math.max(wPt, hPt);
      const wPx = Math.round(wPt * zoom);
      const hPx = Math.round(hPt * zoom);
      const step = TILE - OVERLAP;
      const cols = Math.max(1, Math.ceil((wPx - OVERLAP) / step));
      const rows = Math.max(1, Math.ceil((hPx - OVERLAP) / step));

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const tx0 = c * step;
          const ty0 = r * step;
          const tx1 = Math.min(tx0 + TILE, wPx);
          const ty1 = Math.min(ty0 + TILE, hPx);
          blocks.push({
            type: "text",
            text: `Page ${p + 1}, tile row ${r + 1} of ${rows}, col ${c + 1} of ${cols}:`,
          });
          blocks.push(pngImageBlock(renderRegion(page, zoom, [tx0, ty0, tx1, ty1])));
        }
      }
    }

    if (pageCount > pagesToTile) {
      blocks.push({
        type: "text",
        text: `Note: only the first ${pagesToTile} of ${pageCount} pages were tiled; remaining pages were not analyzed.`,
      });
    }

    return blocks;
  } catch (err) {
    console.error("[pdfImages] tiling failed, falling back to document block:", err?.message ?? err);
    return [documentBlock(buffer, title)];
  } finally {
    doc.destroy();
  }
}
