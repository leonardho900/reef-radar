import type { Metadata } from "next";
import BackendWakeup from "./BackendWakeup";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReefRadar",
  description: "Record dives and discover recent marine-life sightings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <BackendWakeup />
        {children}
      </body>
    </html>
  );
}
