import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { BACKGROUND } from "@/utils/constants";

// SVG for the emoji favicon: 🏗️🇨🇦 using separate text elements, further reduced font
// and Unicode escape for the Canadian flag emoji.
const canadianFlagEmoji = "\u{1F1E8}\u{1F1E6}"; // 🇨🇦
const emojiFaviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <text x='5' y='65' font-size='45'>🏗️</text>
    <text x='50' y='65' font-size='45'>${canadianFlagEmoji}</text>
  </svg>`;
// A bit of trial and error might be needed for x, y, and font-size
// to get them perfectly aligned and sized in the small favicon space.
// The y='72' and font-size='60' are estimations to make them fit side-by-side.

const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(emojiFaviconSvg)}`;
const title = `Canadian Startup Jobs - Build Canada 🏗️${canadianFlagEmoji}`;
const description = "Apply to jobs at Canadian owned and operated startups";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://buildcanada.com",
  ),
  title,
  description,
  icons: {
    icon: faviconDataUrl,
    // You could also specify other icon types if needed, e.g.:
    // apple: faviconDataUrl, // For Apple touch icon
    // shortcut: faviconDataUrl, // For older browsers
  },
  openGraph: {
    title,
    description,
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "Build Canada - Canadian Startup Jobs Board",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [""],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: BACKGROUND }}>
        {children}
      </body>
    </html>
  );
}