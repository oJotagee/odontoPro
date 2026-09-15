import { Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner"

import { SessionAuthProvider } from "@/components/session-auth"

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OdontoPRO",
  description: "Portal da clínica OdontoPRO",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-br"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionAuthProvider>
          <Toaster
            duration={2500}
          />
          
          {children}
        </SessionAuthProvider>
      </body>
    </html>
  );
}
