import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from "../components/providers/ReduxProvider";
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
 title: "Qallcert — Online Learning",
 description: "A modern, scalable learning management platform with dynamic courses and analytics.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
 <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 ">
 <ReduxProvider>{children}</ReduxProvider>
 </body>
 </html>
 );
}
