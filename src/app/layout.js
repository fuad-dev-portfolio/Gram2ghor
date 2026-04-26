import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar.jsx";
import HeaderTop from "@/components/Header-top.jsx";
import Footer from "@/components/Footer.jsx";
import WhatsAppChatWidget from "@/components/WhatsAppChatWidget.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gram2ghor - Collections of Organic Products",
  description: "Gram2ghor is promising to deliver organic food products from direct gram to your home",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <HeaderTop />
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <WhatsAppChatWidget />
      </body>
    </html>
  );
}
