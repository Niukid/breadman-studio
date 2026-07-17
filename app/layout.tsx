import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Breadman — Estudio de diseño",
  description:
    "Breadman — estudio de diseño. Identidad, web y motion. Valle del Aconcagua, Chile.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`} style={{ margin: 0 }}>
        {children}
        <Script
          src="//code.tidio.co/wb2r3ql60w1vmk7ghpbeuu8yfpu1b1pu.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
