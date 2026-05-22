import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SprintPow - AI Sprint Planning Assistant",
  description: "Intelligent sprint planning powered by MiMo v2.5 Pro AI. Estimate story points, identify dependencies, and optimize your sprint capacity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
