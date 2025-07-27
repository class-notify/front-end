"use client"

import type React from "react"

import { Book, Calendar, Settings, Bell, MapPin } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const adminNavigation = [
  {
    title: "Gestión",
    items: [
      {
        title: "Materias",
        view: "materias",
        icon: Book,
        id: "nav-materias",
      },
      {
        title: "Aulas",
        view: "aulas",
        icon: MapPin,
        id: "nav-aulas",
      },
      {
        title: "Horarios",
        view: "horarios",
        icon: Calendar,
        id: "nav-horarios",
      },
    ],
  },
]

const suscriptorNavigation = [
  {
    title: "Mi Dashboard",
    items: [
      {
        title: "Mis Clases",
        view: "dashboard",
        icon: Calendar,
        id: "nav-clases",
      },
      {
        title: "Suscripciones",
        view: "suscripciones",
        icon: Book,
        id: "nav-suscripciones",
      },
    ],
  },
  {
    title: "Configuración",
    items: [
      {
        title: "Preferencias",
        view: "settings",
        icon: Settings,
        id: "nav-user-settings",
      },
    ],
  },
]

export function AppSidebar({
  userRole = "admin",
  currentView = "horarios",
  onNavigate,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  userRole?: "admin" | "suscriptor"
  currentView?: string
  onNavigate?: (view: string) => void
}) {
  const navigation = userRole === "admin" ? adminNavigation : suscriptorNavigation

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Bell className="h-6 w-6 text-primary" />
          <span className="font-semibold">Aulero</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.view === currentView}>
                      <button type="button" onClick={() => onNavigate?.(item.view)} className="w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
