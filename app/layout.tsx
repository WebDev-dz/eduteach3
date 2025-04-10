import type React from "react"
import { NextAuthProvider } from "@/components/providers/session-provider"
import { SonnerProvider } from "@/components/providers/sonner-provider"
import { QueryProvider } from "@/providers/query-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextAuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </NextAuthProvider>
        <SonnerProvider />
      </body>
    </html>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
