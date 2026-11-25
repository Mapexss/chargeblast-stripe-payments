"use server";

import { cookies } from "next/headers";
import { THEME_COOKIE, type Theme } from "@/lib/theme";

export async function setThemeAction(theme: Theme) {
  const jar = await cookies();
  jar.set(THEME_COOKIE, theme, {
    path: "/",
    maxAge: 31_536_000,
    sameSite: "lax",
  });
}
