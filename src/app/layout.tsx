import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConvexClientProvider from "./ConvexClientProvider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ethical digital nation",
  description:
    "An ethical digital nation where you can  collaborate with others to build a better world.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body className="min-h-screen">
          <Toaster />
          <Navbar />
          <main
            className={`${inter.className}  h-full mx-auto mt-12 container`}
          >
            {children}
          </main>
        </body>
      </html>
    </ConvexClientProvider>
  )
}
