import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

// Create a new session
export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { clientName, plantName, cmmsFileName, cmmsRowCount, cmmsText, assets } = body ?? {};
  if (!clientName || !plantName || !cmmsFileName) {
    return Response.json(
      { error: "clientName, plantName and cmmsFileName are required." },
      { status: 400 }
    );
  }

  try {
    const sql = getSql();
    const rows = (await sql`
      INSERT INTO sessions (client_name, plant_name, cmms_file_name, cmms_row_count, cmms_text, assets)
      VALUES (${clientName}, ${plantName}, ${cmmsFileName}, ${cmmsRowCount ?? 0}, ${cmmsText ?? ""}, ${JSON.stringify(assets ?? [])}::jsonb)
      RETURNING id
    `) as { id: string }[];
    return Response.json({ id: rows[0].id });
  } catch (err) {
    console.error("[sessions] create failed:", err);
    return Response.json({ error: "Could not save session." }, { status: 500 });
  }
}
