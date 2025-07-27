"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Clock, Save, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UserProfile {
  full_name: string
  email: string
  whatsapp_number: string
  default_notification_time: number
}

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userProfile: UserProfile
  onProfileUpdate: (profile: UserProfile) => void
}

export function ProfileModal({ open, onOpenChange, userProfile, onProfileUpdate }: ProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(userProfile)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<UserProfile>>({})
  const [successMessage, setSuccessMessage] = useState("")

  const validateForm = () => {
    const newErrors: Partial<UserProfile> = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = "El nombre completo es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }

    if (formData.whatsapp_number && !/^\+?[\d\s-()]{10,}$/.test(formData.whatsapp_number)) {
      newErrors.whatsapp_number = "Formato de número inválido (ej: +54 9 11 1234-5678)"
    }

    if (formData.default_notification_time < 5 || formData.default_notification_time > 120) {
      newErrors.default_notification_time = "Debe estar entre 5 y 120 minutos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setSuccessMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onProfileUpdate(formData)
      setSuccessMessage("Perfil actualizado exitosamente")

      setTimeout(() => {
        onOpenChange(false)
        setSuccessMessage("")
      }, 1500)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const formatWhatsAppNumber = (number: string) => {
    // Remove all non-digit characters except +
    const cleaned = number.replace(/[^\d+]/g, "")
    return cleaned
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="brand-heading flex items-center gap-2">
            <User className="h-5 w-5 text-primary icon-glow" />
            Configuración de Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {successMessage && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <Card className="brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Nombre Completo *
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  placeholder="Ej: Juan Carlos Pérez"
                  className={errors.full_name ? "border-red-500" : ""}
                />
                {errors.full_name && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.full_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ej: juan.perez@estudiante.edu"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Configuration */}
          <Card className="brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-500" />
                WhatsApp
                <Badge variant="secondary" className="text-xs">
                  Opcional
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number" className="text-sm font-medium">
                  Número de WhatsApp
                </Label>
                <Input
                  id="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleInputChange("whatsapp_number", formatWhatsAppNumber(e.target.value))}
                  placeholder="Ej: +54 9 11 1234-5678"
                  className={errors.whatsapp_number ? "border-red-500" : ""}
                />
                {errors.whatsapp_number && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.whatsapp_number}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Incluye el código de país. Ej: +54 para Argentina</p>
              </div>

              {formData.whatsapp_number && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">WhatsApp configurado</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Podrás recibir notificaciones por WhatsApp en este número
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="brand-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Preferencias de Notificación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default_notification_time" className="text-sm font-medium">
                  Tiempo de anticipación por defecto
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="default_notification_time"
                    type="number"
                    value={formData.default_notification_time}
                    onChange={(e) => handleInputChange("default_notification_time", Number(e.target.value))}
                    min="5"
                    max="120"
                    className={`w-24 ${errors.default_notification_time ? "border-red-500" : ""}`}
                  />
                  <span className="text-sm text-muted-foreground">minutos antes</span>
                </div>
                {errors.default_notification_time && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.default_notification_time}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Este será el tiempo por defecto para nuevas suscripciones
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleSave} disabled={isLoading} className="brand-button flex-1">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
