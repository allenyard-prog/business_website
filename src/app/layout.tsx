import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wonderhow — Software for what’s next",
  description:
    "Wonderhow is an independent software consultancy helping ambitious teams turn complex challenges into useful, lovable digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
