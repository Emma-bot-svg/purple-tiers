import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated metadata for Purple Tiers
export const metadata: Metadata = {
  title: "PRXPLE TIERS",
  description: "The official leaderboard and tier rankings for PRXPLE SMP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Changed background to black to match the purple theme logic */}
      <body className="min-h-full flex flex-col bg-black">
        {children}
      </body>
    </html>
  );
}
