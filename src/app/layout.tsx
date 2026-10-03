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

export const metadata: Metadata = {
  title: {
    default: "GardenCare AI — See the problem. Understand the plant. Care better.",
    template: "%s · GardenCare AI",
  },
  description:
    "AI-powered plant health analysis for smarter gardening. Upload a leaf photo and get a quick indication of possible plant health problems — analyzed privately on your device.",
  applicationName: "GardenCare AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-canvas font-sans text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
