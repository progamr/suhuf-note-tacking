import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cabin_Sketch } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cabinSketch = Cabin_Sketch({
  variable: "--font-cabin-sketch",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Suhuf - AI-powered Notes",
  description: "AI-powered note-taking and conversation assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cabinSketch.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
