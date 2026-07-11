import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FER Music Playlist",
  description: "Create a Spotify playlist from an expression-based mood estimate."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
