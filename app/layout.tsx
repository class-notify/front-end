import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Aulero - Te canta el aula",
  description: "Notificaciones instantáneas sobre tus clases universitarias. ¡No te pierdas ninguna!",
  keywords: ["universidad", "clases", "notificaciones", "aulas", "estudiantes"],
  authors: [{ name: "Aulero Team" }],
  creator: "Aulero",
  openGraph: {
    title: "Aulero - Te canta el aula",
    description: "Notificaciones instantáneas sobre tus clases universitarias",
    type: "website",
    locale: "es_ES",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={cn(inter.variable, poppins.variable)} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
