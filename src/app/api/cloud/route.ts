/**
 * Cloud backup route — the ONLY place that talks to Supabase.
 *
 * The browser calls this same-origin route; the server uses the server-only
 * secret key (never exposed to the client) to read/write the database.
 * RLS is enabled on all tables with no public policies, so the publishable /
 * anon keys have zero access — only this route can touch the data.
 *
 * Returns 503 { error: "not_configured" } when Supabase env vars are absent —
 * the app then simply stays local-only (nothing breaks).
 */
import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 2 * 1024 * 1024; // 2 MB — generous for a 512px scan JPEG

let cachedClient: SupabaseClient | null | undefined;

function getSupabase(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  cachedClient =
    url && key
      ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
      : null;
  return cachedClient;
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

type Body = { deviceId?: unknown; action?: unknown; payload?: unknown };

export async function POST(request: Request) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return errorResponse("payload_too_large", 413);

  let body: Body;
  try {
    body = JSON.parse(text) as Body;
  } catch {
    return errorResponse("invalid_json");
  }

  const { deviceId, action, payload } = body;
  if (typeof deviceId !== "string" || !UUID_RE.test(deviceId)) {
    return errorResponse("invalid_device_id");
  }
  if (typeof action !== "string") return errorResponse("invalid_action");

  switch (action) {
    case "list": {
      const [plants, scans, reports] = await Promise.all([
        supabase.from("plants").select("*").eq("device_id", deviceId).order("created_at", { ascending: false }).limit(300),
        supabase.from("scans").select("*").eq("device_id", deviceId).order("created_at", { ascending: false }).limit(300),
        supabase.from("problem_reports").select("*").eq("device_id", deviceId).order("created_at", { ascending: false }).limit(300),
      ]);
      if (plants.error || scans.error || reports.error) return errorResponse("read_failed", 500);
      return NextResponse.json({
        ok: true,
        plants: plants.data ?? [],
        scans: scans.data ?? [],
        reports: reports.data ?? [],
      });
    }
    case "upsert-plant":
      return upsert(supabase, "plants", deviceId, payload);
    case "upsert-scan":
      return upsert(supabase, "scans", deviceId, payload);
    case "upsert-report":
      return upsert(supabase, "problem_reports", deviceId, payload);
    case "delete-plant":
      return remove(supabase, "plants", deviceId, payload);
    case "delete-scan":
      return remove(supabase, "scans", deviceId, payload);
    case "delete-report":
      return remove(supabase, "problem_reports", deviceId, payload);
    case "wipe": {
      const results = await Promise.all([
        supabase.from("plants").delete().eq("device_id", deviceId),
        supabase.from("scans").delete().eq("device_id", deviceId),
        supabase.from("problem_reports").delete().eq("device_id", deviceId),
      ]);
      if (results.some((result) => result.error)) return errorResponse("wipe_failed", 500);
      return NextResponse.json({ ok: true });
    }
    default:
      return errorResponse("unknown_action");
  }
}

async function upsert(
  supabase: SupabaseClient,
  table: "plants" | "scans" | "problem_reports",
  deviceId: string,
  payload: unknown,
) {
  if (!payload || typeof payload !== "object") return errorResponse("invalid_payload");
  const row: Record<string, unknown> = {
    ...(payload as Record<string, unknown>),
    // Server-managed fields — a client can never write for another device
    // and can never mark a row as demo.
    device_id: deviceId,
    is_demo: false,
  };
  const id = row["id"];
  if (typeof id !== "string" || id.length === 0 || id.length > 80) {
    return errorResponse("invalid_id");
  }
  const { error } = await supabase.from(table).upsert(row);
  if (error) return errorResponse("write_failed", 500);
  return NextResponse.json({ ok: true });
}

async function remove(
  supabase: SupabaseClient,
  table: "plants" | "scans" | "problem_reports",
  deviceId: string,
  payload: unknown,
) {
  const id = (payload as { id?: unknown } | null)?.id;
  if (typeof id !== "string" || id.length === 0) return errorResponse("invalid_id");
  const { error } = await supabase.from(table).delete().eq("id", id).eq("device_id", deviceId);
  if (error) return errorResponse("delete_failed", 500);
  return NextResponse.json({ ok: true });
}
