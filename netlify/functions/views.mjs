import { getStore } from "@netlify/blobs";

// POST /api/views        -> adds 1 and returns the new total
// POST /api/views?peek=1 -> returns the total without adding
export default async (req) => {
  const store = getStore("stats");
  const url = new URL(req.url);
  const peek = url.searchParams.get("peek") === "1";

  let views = Number(await store.get("views")) || 0;
  if (!peek && req.method === "POST") {
    views += 1;
    await store.set("views", String(views));
  }

  return new Response(JSON.stringify({ views }), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
};

export const config = { path: "/api/views" };
