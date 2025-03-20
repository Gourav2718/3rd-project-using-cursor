import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guardians of Maharashtra: A Map of Historic Forts",
  description: "Explore the historic forts of Maharashtra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-slate-800 text-white py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center">© {new Date().getFullYear()} Guardians of Maharashtra. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
