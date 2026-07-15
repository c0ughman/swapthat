import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Marcellus } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Brand wordmark face — "Muévete con Andrea" lockup only, never body copy. */
const marcellus = Marcellus({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Muévete con Andrea — Andrea Vasquez",
  description: "Diseño sistemas sostenibles para crecer — en marcas y en personas.",
  // favicon.ico / icon.png / apple-icon.png in src/app are picked up automatically.
  manifest: "/site.webmanifest",
};

/** Brown tile behind the cream sun — matches the favicon and the brand bands. */
export const viewport: Viewport = {
  themeColor: "#582d1b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${marcellus.variable} antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
