// app/layout.tsx

import type { Metadata } from "next";
import { Bricolage_Grotesque, Public_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Public_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://calculator-bmr-tdee.vercel.app/"),
  title: "BMR TDEE Calculator | Rata metabolica si necesar caloric",
  description:
    "Calculator simplu pentru estimarea BMR, TDEE, calorii tinta, macro-uri si hidratare in functie de activitate zilnica, pasi, job, antrenamente si obiectiv.",
  keywords: [
    "BMR TDEE Calculator",
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
    title: "BMR TDEE Calculator | Rata metabolica si necesar caloric",
    description:
      "Estimeaza BMR, TDEE, calorii tinta, macro-uri si hidratare pe baza activitatii zilnice, pasilor, jobului si antrenamentelor.",
    type: "website",
    locale: "ro_RO",
    url: "https://calculator-bmr-tdee.vercel.app/",
    siteName: "BMR TDEE Calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMR TDEE Calculator | Rata metabolica si necesar caloric",
    description:
      "Estimeaza BMR, TDEE, calorii tinta, macro-uri si hidratare pe baza activitatii zilnice, pasilor, jobului si antrenamentelor.",
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
        className={`${displayFont.variable} ${bodyFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}