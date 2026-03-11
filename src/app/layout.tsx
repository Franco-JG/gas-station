import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sileo"
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

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

  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased `}
      > 
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
        <Toaster
          position="top-center"
          options={{
            styles: { description: "text-tertiary-6" },
            fill: "#171717",
            autopilot: {
              expand: 500,
              collapse: 3500,
            },
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
