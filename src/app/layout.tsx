import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})


export const metadata: Metadata = {
  title: "Gas Tracker",
  description: "A simple app to track fuel prices.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
