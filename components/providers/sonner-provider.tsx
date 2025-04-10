"use client"

import { Toaster } from "sonner"

export function SonnerProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "rounded-md border bg-background text-foreground",
        duration: 3000,
      }}
    />
  )
}
