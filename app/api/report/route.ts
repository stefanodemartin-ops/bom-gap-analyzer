import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { ReportDocument } from "@/lib/report";
import { Asset, Session } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { session: Session; asset: Asset };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body?.session || !body?.asset?.result) {
    return Response.json({ error: "session and asset are required." }, { status: 400 });
  }

  try {
    const buffer = await renderToBuffer(
      createElement(ReportDocument, {
        session: body.session,
        asset: body.asset,
      }) as unknown as ReactElement<DocumentProps>
    );
    const slug = body.asset.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sparesview-gap-analysis-${slug}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[report] PDF generation failed:", err);
    return Response.json({ error: "Could not generate the report." }, { status: 500 });
  }
}
