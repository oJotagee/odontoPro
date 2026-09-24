"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const appointmentSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email é obrigatório"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  serviceId: z.string().min(1, "Serviço é obrigatório"),
  date: z.date(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

export function useAppointmentForm() {
  return useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceId: "",
      date: new Date(),
    },
  })
}