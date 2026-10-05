import { Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner"

import { SessionAuthProvider } from "@/components/session-auth"
import { QueryClientContext } from "@/providers/query-client"

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OdontoPRO",
  description: "Portal da clínica OdontoPRO",
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
  openGraph: {
    title: "OdontoPRO",
    description: "Portal da clínica OdontoPRO",
    images: [`${process.env.NEXT_PUBLIC_BASE_URL}/public/doctor-hero.png`],
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-br"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SessionAuthProvider>
          <QueryClientContext>
            <Toaster
              duration={2500}
            />

            {children}
          </QueryClientContext>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
