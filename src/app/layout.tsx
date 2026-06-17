import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { releaseMetadata } from "@/lib/gallery/release";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(releaseMetadata.url),
  title: releaseMetadata.title,
  description: releaseMetadata.description,
  applicationName: releaseMetadata.title,
  icons: releaseMetadata.icons,
  openGraph: {
    title: releaseMetadata.title,
    description: releaseMetadata.description,
    url: releaseMetadata.url,
    siteName: releaseMetadata.title,
    images: releaseMetadata.openGraph.images.map((url) => ({
      url,
      width: 1200,
      height: 630,
      alt: "Personal Motion Gallery preview"
    })),
    type: "website"
  },
  twitter: {
    card: releaseMetadata.twitter.card,
    title: releaseMetadata.title,
    description: releaseMetadata.description,
    images: [...releaseMetadata.openGraph.images]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
