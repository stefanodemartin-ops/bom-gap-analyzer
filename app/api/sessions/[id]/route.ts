import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RouteContext = { params: Promise<{ id: string }> };

// Fetch a session by id
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) {
    return Response.json({ error: "Invalid session id." }, { status: 400 });
  }

  try {
    const sql = getSql();
    const rows = (await sql`
      SELECT id, client_name, plant_name, cmms_file_name, cmms_row_count, cmms_text, assets, updated_at
      FROM sessions WHERE id = ${id}
    `) as Record<string, unknown>[];
    if (rows.length === 0) {
      return Response.json({ error: "Session not found." }, { status: 404 });
    }
    const r = rows[0];
    return Response.json({
      id: r.id,
      clientName: r.client_name,
      plantName: r.plant_name,
      cmmsFileName: r.cmms_file_name,
      cmmsRowCount: r.cmms_row_count,
      cmmsText: r.cmms_text,
      assets: r.assets,
      updatedAt: r.updated_at,
    });
  } catch (err) {
    console.error("[sessions] fetch failed:", err);
    return Response.json({ error: "Could not load session." }, { status: 500 });
  }
}

// Update a session's assets
export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) {
    return Response.json({ error: "Invalid session id." }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const sql = getSql();
    const rows = (await sql`
      UPDATE sessions
      SET assets = ${JSON.stringify(body?.assets ?? [])}::jsonb, updated_at = now()
      WHERE id = ${id}
      RETURNING id
    `) as { id: string }[];
    if (rows.length === 0) {
      return Response.json({ error: "Session not found." }, { status: 404 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[sessions] update failed:", err);
    return Response.json({ error: "Could not save changes." }, { status: 500 });
  }
}
