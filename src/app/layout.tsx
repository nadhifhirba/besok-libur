import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo_Black, DM_Sans } from "next/font/google";
import Link from "next/link";

import "./globals.css";

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BESOK_LIBUR — Jakarta Event Discovery",
  description: "Brutalist event discovery for Jakarta's underground.",
  openGraph: {
    title: "BESOK_LIBUR",
    description: "Jakarta events. No algorithms. Just good curation.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className="dark" suppressHydrationWarning>
      <body className={`${archivoBlack.variable} ${dmSans.variable} bg-black text-white antialiased`}>
        {/* CRT Scanline */}
        <div className="crt-overlay" aria-hidden="true" />

        {/* Brutalist Header */}
        <header className="sticky top-0 z-50 border-brutal-b bg-black/95 backdrop-blur-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <span
                className="text-2xl font-black tracking-tighter text-white"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                BESOK_
                <span className="text-zinc-700">LIBUR</span>
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/saved"
                className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:text-white"
              >
                Saved
              </Link>
              <Link
                href="/add"
                className="btn-brutal text-xs"
              >
                + Add Event
              </Link>
            </nav>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="border-brutal-t mt-24 px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span
              className="text-sm font-black tracking-tighter text-zinc-600"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              BESOK_LIBUR
            </span>
            <span className="text-xs text-zinc-700">
              Jakarta event discovery. Curated by humans.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
