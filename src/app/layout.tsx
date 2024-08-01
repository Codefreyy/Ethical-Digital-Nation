import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import ConvexClientProvider from "./ConvexClientProvider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/Navbar"

const montserrat = Montserrat({ subsets: ["latin"] })

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
      <html lang="en" className={`${montserrat.className}`}>
        <body className="min-h-screen bg-gray-50 text-gray-950 relative dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90">
          <div className="bg-[#fffbfb] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:hidden"></div>
          <div className="bg-[#f9f8fc] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:hidden"></div>
          <Toaster />
          <Navbar />
          <main className={`h-full mx-auto mt-12 container`}>{children}</main>
        </body>
      </html>
    </ConvexClientProvider>
  )
}
