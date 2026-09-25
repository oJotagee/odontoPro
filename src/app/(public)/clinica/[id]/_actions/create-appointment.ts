"use server"

import prisma from "@/lib/prisma"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
  time: z.string().min(1, "O horário é obrigatório"),
  clinicId: z.string().min(1, "A clínica é obrigatória")
})

export type FormSchema = z.infer<typeof formSchema>

export async function createNewAppointment(data: FormSchema) {
  const schema = formSchema.safeParse(data)

  if(!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const selectedDate = new Date(data.date)

    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const day = selectedDate.getDate()

    const appointmentDate = new Date(year, month, day, 0, 0, 0)

    const newAppointment = await prisma.appointment.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        time: data.time,
        appointmentDate: appointmentDate,
        serviceId: data.serviceId,
        userId: data.clinicId
      }
    })

    return {
      data: newAppointment
    }
  } catch (error) {
    console.error(error)

    return {
      error: "Erro ao realizar o agendamento"
    }
  }
}