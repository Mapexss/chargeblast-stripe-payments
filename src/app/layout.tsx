import type { Metadata } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import { parseTheme } from "@/lib/theme";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Inter-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const instant = false;

export const metadata: Metadata = {
  title: {
    default: "Payments — Stripe",
    template: "%s — Stripe",
  },
  description: "Stripe Dashboard payments replica for Chargeblast assessment.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Payments — Stripe",
    description: "Stripe Dashboard payments replica for Chargeblast assessment.",
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const jar = await cookies();
  const theme = parseTheme(jar.get("theme")?.value);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased ${theme === "dark" ? "dark" : ""}`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text font-sans">
        {children}
      </body>
    </html>
  );
}
