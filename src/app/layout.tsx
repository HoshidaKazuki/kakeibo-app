import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const rounded = M_PLUS_Rounded_1c({
  variable: "--font-rounded",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const headline = Zen_Maru_Gothic({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "かけぼっちゃん",
  description: "かんたん家計簿アプリ「かけぼっちゃん」",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "かけぼっちゃん",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon?size=192", sizes: "192x192", type: "image/png" },
      { url: "/icon?size=512", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport = {
  themeColor: "#f5ede0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${rounded.variable} ${headline.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
