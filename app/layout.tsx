// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calculator BMR / TDEE / Calorii si Macro-uri",
  description:
    "Calculator simplu pentru estimarea BMR, TDEE, calorii tinta si macro-uri in functie de activitate zilnica, pasi, job, antrenamente si obiectiv.",
  keywords: [
    "calculator BMR",
    "calculator TDEE",
    "calculator calorii",
    "macro-uri",
    "slabire",
    "mentinere",
    "masa musculara",
    "fitness",
    "nutritie",
  ],
  authors: [
    {
      name: "Alexandru Mihai",
    },
  ],
  creator: "Alexandru Mihai",
  openGraph: {
    title: "Calculator BMR / TDEE / Calorii si Macro-uri",
    description:
      "Estimeaza BMR, TDEE, calorii tinta si macro-uri pe baza activitatii zilnice, pasilor, jobului si antrenamentelor.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}