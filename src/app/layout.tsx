import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinBoard | Real-time Finance Dashboard",
  description: "Track stocks, crypto, and market data in real-time with your custom FinBoard dashboard. Built with Next.js and Tailwind CSS.",
  keywords: ["finance", "dashboard", "crypto", "stocks", "tracking", "real-time", "analytics"],
  authors: [{ name: "FinBoard" }],
  openGraph: {
    title: "FinBoard - Real-time Finance Dashboard",
    description: "Track stocks, crypto, and market data in real-time.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinBoard",
    description: "Real-time Finance Dashboard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
