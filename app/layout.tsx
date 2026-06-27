import type { Metadata } from "next";
import { Lora, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Fonts per design.md substitutes:
// display serif (P22 Mackinac → Lora), body sans (Sofia Pro → DM Sans),
// label mono (IBM Plex Mono, direct).
const display = Lora({
  subsets: ["latin"],
  variable: "--font-display-src",
  display: "swap",
});
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans-src",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-src",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindBalance — your exam-season companion",
  description:
    "An empathetic GenAI wellbeing companion for students preparing for high-stakes exams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-paper-white text-charcoal-navy">
        {children}
      </body>
    </html>
  );
}
