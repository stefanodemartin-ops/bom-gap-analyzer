import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

async function ensureTable(sql: ReturnType<typeof getSql>) {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      company text,
      plant text,
      role text,
      num_plants text,
      message text,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, company, plant, role, numPlants, message, website } = body ?? {};

  // Honeypot filled → bot. Pretend success, store nothing.
  if (website) return Response.json({ ok: true });

  if (!name || !email || typeof email !== "string" || !email.includes("@")) {
    return Response.json({ error: "Name and a valid work email are required." }, { status: 400 });
  }

  const clip = (v: unknown, max: number) =>
    typeof v === "string" ? v.slice(0, max) : null;

  try {
    const sql = getSql();
    await ensureTable(sql);
    await sql`
      INSERT INTO leads (name, email, company, plant, role, num_plants, message)
      VALUES (
        ${clip(name, 200)}, ${clip(email, 200)}, ${clip(company, 200)},
        ${clip(plant, 200)}, ${clip(role, 200)}, ${clip(numPlants, 50)},
        ${clip(message, 5000)}
      )
    `;
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[leads] insert failed:", err);
    return Response.json(
      { error: "Could not save your request — please email us directly." },
      { status: 500 }
    );
  }
}
