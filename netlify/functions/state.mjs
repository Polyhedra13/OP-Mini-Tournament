// OP Mini Tournament score store: GET = anyone reads, PUT = organizer saves (PIN), POST verify = PIN check.
import { getStore } from "@netlify/blobs";

const KEY = "tournament";
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req) => {
  const store = getStore({ name: "op-mini-tournament", consistency: "strong" });
  const pin = process.env.ORGANIZER_PIN;
  const pinOk = () => !!pin && req.headers.get("x-organizer-pin") === pin;

  if (req.method === "GET") {
    const data = await store.get(KEY, { type: "json" });
    return json(data || { rev: 0, state: null });
  }

  if (req.method === "POST") {
    if (!pin) return json({ error: "ORGANIZER_PIN is not set on this site." }, 500);
    return pinOk() ? json({ ok: true }) : json({ error: "Wrong PIN" }, 401);
  }

  if (req.method === "PUT") {
    if (!pinOk()) return json({ error: "Wrong PIN" }, 401);
    const raw = await req.text();
    if (raw.length > 500_000) return json({ error: "Too large" }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ error: "Bad JSON" }, 400); }
    if (!body || !body.state || typeof body.state.cats !== "object") return json({ error: "Bad state" }, 400);

    const current = (await store.get(KEY, { type: "json" })) || { rev: 0, state: null };
    if ((body.rev || 0) !== current.rev) return json(current, 409); // someone saved first

    const next = { rev: current.rev + 1, state: body.state, updatedAt: new Date().toISOString() };
    await store.setJSON(KEY, next);
    return json({ rev: next.rev });
  }

  return json({ error: "Method not allowed" }, 405);
};

export const config = { path: "/api/state" };
