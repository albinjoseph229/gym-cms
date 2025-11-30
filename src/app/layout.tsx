import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oasis Fitness Academy",
  description: "Premium Fitness Academy in Wayand District - Valad, Vellamunda, Korome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
