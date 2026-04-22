import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const jwt = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(
      jwt,
    );
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub;

    const body = await req.json().catch(() => ({}));
    const code = body?.code as string | undefined;
    if (!code) {
      return new Response(JSON.stringify({ error: "Missing code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientId = Deno.env.get("INSTAGRAM_APP_ID");
    const clientSecret = Deno.env.get("INSTAGRAM_APP_SECRET");
    const redirectUri = Deno.env.get("INSTAGRAM_REDIRECT_URI");

    if (!clientId || !clientSecret || !redirectUri) {
      return new Response(
        JSON.stringify({ error: "Instagram integration not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 1) Exchange code for short-lived token
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
      console.error("short-token error", shortJson);
      return new Response(
        JSON.stringify({
          error: shortJson?.error_message ||
            shortJson?.error?.message ||
            "Falha ao trocar code por token",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const shortToken = shortJson.access_token as string;
    const permissions = shortJson.permissions ?? null;

    // 2) Exchange for long-lived token (60 days)
    const longUrl = new URL("https://graph.instagram.com/access_token");
    longUrl.searchParams.set("grant_type", "ig_exchange_token");
    longUrl.searchParams.set("client_secret", clientSecret);
    longUrl.searchParams.set("access_token", shortToken);

    const longRes = await fetch(longUrl.toString());
    const longJson = await longRes.json();
    if (!longRes.ok) {
      console.error("long-token error", longJson);
      return new Response(
        JSON.stringify({
          error: longJson?.error?.message ||
            "Falha ao obter long-lived token",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    const longToken = longJson.access_token as string;
    const tokenType = (longJson.token_type as string) ?? "bearer";

    // 3) Fetch basic profile
    const meUrl = new URL("https://graph.instagram.com/v21.0/me");
    meUrl.searchParams.set("fields", "id,username,account_type");
    meUrl.searchParams.set("access_token", longToken);

    const meRes = await fetch(meUrl.toString());
    const meJson = await meRes.json();
    if (!meRes.ok) {
      console.error("me error", meJson);
      return new Response(
        JSON.stringify({
          error: meJson?.error?.message ||
            "Falha ao obter perfil do Instagram",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const instagramUserId = String(meJson.id);
    const username = meJson.username as string;
    const displayName = (meJson.account_type as string) ?? null;

    // 4) Upsert in DB (RLS: user_id = auth.uid())
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
      console.error("upsert error", upsertError);
      return new Response(
        JSON.stringify({ error: "Falha ao salvar conta no banco" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({ success: true, username }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("oauth-callback error", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message ?? "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
