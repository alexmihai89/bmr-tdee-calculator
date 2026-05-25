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
  title: "AM Calorie Calculator | BMR, TDEE si Macro-uri",
  description:
    "Calculator simplu pentru estimarea BMR, TDEE, calorii tinta, macro-uri si hidratare in functie de activitate zilnica, pasi, job, antrenamente si obiectiv.",
  keywords: [
    "AM Calorie Calculator",
    "Alexandru Mihai",
    "calculator BMR",
    "calculator TDEE",
    "calculator calorii",
    "macro-uri",
    "hidratare",
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
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  openGraph: {
    title: "AM Calorie Calculator | BMR, TDEE si Macro-uri",
    description:
      "Estimeaza BMR, TDEE, calorii tinta, macro-uri si hidratare pe baza activitatii zilnice, pasilor, jobului si antrenamentelor.",
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