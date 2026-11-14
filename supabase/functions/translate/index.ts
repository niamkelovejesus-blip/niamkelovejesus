// Edge Function « translate » : traduit avec l'API officielle Google Cloud Translation (v2).
// La clé Google reste secrète ici (jamais dans le site). Un cache en base évite de payer deux fois le même texte.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const KEY = Deno.env.get("GOOGLE_TRANSLATE_KEY") || "";
const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") || "").split(",").map((s) => s.trim()).filter(Boolean);
const LANGS = new Set(["fr","en","es","pt","it","de","ar","zh-CN","nl","ru","ln","sw","hi","id","tl","ko","vi","pl","uk","ur","ro"]);

async function sha(t: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const okOrigin = !ALLOWED.length || ALLOWED.includes(origin);
  const h: Record<string, string> = {
    "Access-Control-Allow-Origin": okOrigin && origin ? origin : (ALLOWED[0] || "*"),
    "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Content-Type": "application/json",
  };
  const out = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: h });

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
  if (req.method !== "POST") return out({ error: "method" }, 405);
  if (!okOrigin) return out({ error: "origin" }, 403);
  if (!KEY) return out({ error: "GOOGLE_TRANSLATE_KEY manquante" }, 500);

  let body: { target?: string; texts?: unknown };
  try { body = await req.json(); } catch { return out({ error: "json" }, 400); }
  const target = String(body.target || "");
  const texts = Array.isArray(body.texts) ? body.texts.map((x) => String(x ?? "")) : [];
  if (!LANGS.has(target)) return out({ error: "langue" }, 400);
  if (!texts.length || texts.length > 100) return out({ error: "taille" }, 400);
  let total = 0;
  for (const t of texts) { total += t.length; if (t.length > 5000) return out({ error: "texte trop long" }, 400); }
  if (total > 20000) return out({ error: "lot trop gros" }, 400);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const hashes = await Promise.all(texts.map(sha));
  const found = new Map<string, string>();
  try {
    const { data } = await sb.from("translation_cache").select("src_hash,translated").eq("lang", target).in("src_hash", hashes);
    (data || []).forEach((r: { src_hash: string; translated: string }) => found.set(r.src_hash, r.translated));
  } catch (_) { /* cache indisponible : on traduit quand même */ }

  const missH: string[] = [], missT: string[] = [];
  texts.forEach((t, i) => { if (!found.has(hashes[i]) && !missH.includes(hashes[i])) { missH.push(hashes[i]); missT.push(t); } });

  if (missT.length) {
    const r = await fetch("https://translation.googleapis.com/language/translate/v2?key=" + encodeURIComponent(KEY), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: missT, target, format: "text" }),
    });
    if (!r.ok) return out({ error: "google", status: r.status }, 502);
    const j = await r.json();
    const tr: string[] = (j?.data?.translations || []).map((x: { translatedText: string }) => x.translatedText);
    if (tr.length !== missT.length) return out({ error: "google format" }, 502);
    const rows = missH.map((hh, i) => ({ lang: target, src_hash: hh, translated: tr[i] }));
    rows.forEach((x) => found.set(x.src_hash, x.translated));
    try { await sb.from("translation_cache").upsert(rows, { onConflict: "lang,src_hash" }); } catch (_) { /* pas grave */ }
  }
  return out({ t: texts.map((t, i) => found.get(hashes[i]) ?? t) });
});
