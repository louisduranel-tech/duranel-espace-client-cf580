"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function RecoveryRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");
    if (!access_token || !refresh_token) return;

    const supabase = createClient();
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      if (error) return;
      const target = type === "recovery" ? "/mettre-a-jour-mot-de-passe" : "/";
      window.location.replace(target);
    });
  }, []);

  return null;
}
