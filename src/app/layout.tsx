import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
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
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen">
          <Navbar />
          <main
            className={`${inter.className} container h-full max-w-7xl mx-auto`}
          >
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}
