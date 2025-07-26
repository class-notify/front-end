"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Clase } from "@/types"

interface ScheduleFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schedule?: Clase | null
  onSave: (schedule: Omit<Clase, "id" | "created_at" | "updated_at">) => void
}

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Literature"]

export function ScheduleFormModal({ open, onOpenChange, schedule, onSave }: ScheduleFormModalProps) {
  const [formData, setFormData] = useState({
    materia_id: schedule?.materia_id || "",
    fecha: schedule?.fecha || "",
    hora_inicio: schedule?.hora_inicio || "",
    hora_fin: schedule?.hora_fin || "",
    aula: schedule?.aula || "",
    estado: schedule?.estado || "programada",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Omit<Clase, "id" | "created_at" | "updated_at">)
    onOpenChange(false)
    // Reset form
    setFormData({
      materia_id: "",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
      aula: "",
      estado: "programada",
    })
  }

  const isEdit = !!schedule

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Schedule" : "New Schedule"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the schedule details below." : "Create a new class schedule."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.materia_id}
                onValueChange={(value) => setFormData({ ...formData, materia_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time End *</Label>
              <Input
                id="time_end"
                type="time"
                value={formData.hora_fin}
                onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroom">Classroom</Label>
              <Input
                id="classroom"
                placeholder="e.g. A101"
                value={formData.aula}
                onChange={(e) => setFormData({ ...formData, aula: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.estado}
                onValueChange={(value: any) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="programada">Por asignar</SelectItem>
                  <SelectItem value="asignada">Asignada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
