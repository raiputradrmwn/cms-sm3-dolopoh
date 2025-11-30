import type { Metadata } from "next";
import "./globals.css";

import { poppins } from "@/style/font";

import QueryProvider from "./provider";

export const metadata: Metadata = {
  title: "CMS SMK Dolopo",
  description: "CMS SMK Dolopo",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
