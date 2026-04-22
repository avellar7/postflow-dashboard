import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function ok(body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 0) Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.error("[callback] missing auth header");
      return ok({ ok: false, error: "Não autenticado" });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("[callback] auth error", userError);
      return ok({ ok: false, error: "Usuário não autenticado" });
    }
    const userId = user.id;
    console.log("[callback] user authenticated:", userId);

    // 1) Parse body
    const body = await req.json().catch(() => ({}));
    const code = body?.code as string | undefined;
    if (!code) {
      console.error("[callback] missing code in body");
      return ok({ ok: false, error: "Código de autorização ausente" });
    }
    console.log("[callback] code received, length:", code.length);

    // 2) Check secrets
    const clientId = Deno.env.get("INSTAGRAM_APP_ID");
    const clientSecret = Deno.env.get("INSTAGRAM_APP_SECRET");
    const redirectUri = Deno.env.get("INSTAGRAM_REDIRECT_URI");

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("[callback] missing secrets", { clientId: !!clientId, clientSecret: !!clientSecret, redirectUri: !!redirectUri });
      return ok({ ok: false, error: "Integração com Instagram não configurada no servidor" });
    }
    console.log("[callback] secrets present");

    // 3) Exchange code for short-lived token
    const form = new URLSearchParams();
    form.set("client_id", clientId);
    form.set("client_secret", clientSecret);
    form.set("grant_type", "authorization_code");
    form.set("redirect_uri", redirectUri);
    form.set("code", code);

    const shortRes = await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      },
    );

    const shortJson = await shortRes.json();
    if (!shortRes.ok) {
      console.error("[callback] short-token error", shortJson);
      return ok({
        ok: false,
        error: shortJson?.error_message || shortJson?.error?.message || "Falha ao trocar code por token",
      });
    }
    console.log("[callback] short token obtained");

    const shortToken = shortJson.access_token as string;
    const permissions = shortJson.permissions ?? null;

    // 4) Exchange for long-lived token (60 days)
    const longUrl = new URL("https://graph.instagram.com/access_token");
    longUrl.searchParams.set("grant_type", "ig_exchange_token");
    longUrl.searchParams.set("client_secret", clientSecret);
    longUrl.searchParams.set("access_token", shortToken);

    const longRes = await fetch(longUrl.toString());
    const longJson = await longRes.json();
    if (!longRes.ok) {
      console.error("[callback] long-token error", longJson);
      return ok({
        ok: false,
        error: longJson?.error?.message || "Falha ao obter long-lived token",
      });
    }
    const longToken = longJson.access_token as string;
    const tokenType = (longJson.token_type as string) ?? "bearer";
    console.log("[callback] long-lived token obtained");

    // 5) Fetch basic profile
    const meUrl = new URL("https://graph.instagram.com/v21.0/me");
    meUrl.searchParams.set("fields", "id,username,account_type");
    meUrl.searchParams.set("access_token", longToken);

    const meRes = await fetch(meUrl.toString());
    const meJson = await meRes.json();
    if (!meRes.ok) {
      console.error("[callback] /me error", meJson);
      return ok({
        ok: false,
        error: meJson?.error?.message || "Falha ao obter perfil do Instagram",
      });
    }

    const instagramUserId = String(meJson.id);
    const username = meJson.username as string;
    const displayName = (meJson.account_type as string) ?? null;
    console.log("[callback] profile fetched:", username, instagramUserId);

    // 6) Upsert in DB
    const { error: upsertError } = await supabase
      .from("instagram_accounts")
      .upsert(
        {
          user_id: userId,
          username,
          display_name: displayName,
          instagram_user_id: instagramUserId,
          access_token: longToken,
          token_type: tokenType,
          permissions,
          connected_at: new Date().toISOString(),
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,instagram_user_id" },
      );

    if (upsertError) {
      console.error("[callback] upsert error", upsertError);
      return ok({ ok: false, error: "Falha ao salvar conta no banco: " + upsertError.message });
    }
    console.log("[callback] account saved successfully");

    return ok({ ok: true, success: true, username });
  } catch (e) {
    console.error("[callback] unhandled error", e);
    return ok({ ok: false, error: (e as Error).message ?? "Erro interno" });
  }
});
