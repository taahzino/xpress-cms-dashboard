import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Rubik } from 'next/font/google';
import "./globals.css";

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "XPRESS CMS",
  description: "Developed by @taahzino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${rubik.className} antialiased dark`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
