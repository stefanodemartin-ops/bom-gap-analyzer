import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  plant: string | null;
  role: string | null;
  num_plants: string | null;
  message: string | null;
  created_at: string;
};

// Private page: /leads?key=<LEADS_KEY env var>. Not linked from anywhere.
export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const expected = process.env.LEADS_KEY;

  if (!expected || key !== expected) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Not authorized.</p>
      </div>
    );
  }

  let leads: Lead[] = [];
  let error: string | null = null;
  try {
    const sql = getSql();
    leads = (await sql`
      SELECT id, name, email, company, plant, role, num_plants, message, created_at
      FROM leads ORDER BY created_at DESC LIMIT 500
    `) as Lead[];
  } catch {
    error = "No leads yet (the table is created when the first lead arrives), or the database is unreachable.";
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Demo requests</h1>
        <p className="text-xs text-slate-400 mb-6">{leads.length} lead{leads.length === 1 ? "" : "s"} · newest first</p>

        {error && <p className="text-sm text-slate-500">{error}</p>}

        {!error && leads.length === 0 && <p className="text-sm text-slate-500">No leads yet.</p>}

        {leads.length > 0 && (
          <div className="bg-white border border-slate-300 rounded-sm overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-50">
                  {["Received", "Name", "Email", "Company", "Plant / Site", "Role", "Plants", "Message"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-[0.1em] text-slate-500 font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-b border-slate-200 last:border-b-0 align-top">
                    <td className="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(l.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-800 whitespace-nowrap">{l.name}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <a href={`mailto:${l.email}`} className="text-sky-600 hover:underline">{l.email}</a>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">{l.company ?? "—"}</td>
                    <td className="px-3 py-2.5 text-slate-600">{l.plant ?? "—"}</td>
                    <td className="px-3 py-2.5 text-slate-600">{l.role ?? "—"}</td>
                    <td className="px-3 py-2.5 text-slate-600 tabular-nums">{l.num_plants ?? "—"}</td>
                    <td className="px-3 py-2.5 text-xs text-slate-600 max-w-[360px]">{l.message ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
