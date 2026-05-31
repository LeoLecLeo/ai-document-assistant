import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assistant IA documentaire",
  description:
    "Upload un PDF, pose une question et obtiens une réponse IA basée sur les sources de ton document.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark bg-background">
      <body>{children}</body>
    </html>
  );
}