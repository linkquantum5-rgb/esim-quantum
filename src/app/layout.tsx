import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
// CORREGIDO: Agregué las llaves { } para que coincida con tu archivo original
import { Navbar } from "@/components/navbar"; 
import { Footer } from "@/components/footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eSIM Quantum - Global eSIM Connectivity",
  description: "Stay connected worldwide with eSIM Quantum. Instant activation, affordable plans, 200+ countries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // AQUÍ SIGUE EL ARREGLO DEL ERROR DE HIDRATACIÓN (suppressHydrationWarning)
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <ClientBody>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </ClientBody>
      </body>
    </html>
  );
}
