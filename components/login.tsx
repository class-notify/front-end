"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Mail } from "lucide-react"

export function Login() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate magic link sending
    setTimeout(() => {
      setIsLoading(false)
      setMagicLinkSent(true)
    }, 2000)
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-800" />
            </div>
            <CardTitle>Revisa tu email</CardTitle>
            <CardDescription>
              Te hemos enviado un enlace mágico a <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Haz clic en el enlace del email para acceder a tu cuenta.
            </p>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setMagicLinkSent(false)}>
              Usar otro email
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Aula‑Notify</CardTitle>
          <CardDescription>Accede con tu email universitario</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu.email@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando enlace...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar enlace mágico
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
