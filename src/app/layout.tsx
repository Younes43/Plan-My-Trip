import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Travel Planner",
  description: "Plan your perfect trip with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-image"></div>
        <div className="main-content">
          <Header />
          <main className="min-h-screen py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}