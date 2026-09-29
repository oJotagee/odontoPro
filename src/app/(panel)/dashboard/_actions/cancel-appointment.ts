"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

const formSchema = z.object({
  appointmentId: z.string({ message: "Id do lembrete é obrigatório" }).min(1, "Id do lembrete é obrigatório")
})

export type FormSchema = z.infer<typeof formSchema>

export async function cancelAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Usuário não autenticado"
    }
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: formData.appointmentId,
        userId: session.user?.id
      }
    })

    revalidatePath("/dashboard")

    return {
      data: "Agendamento cancelado com sucesso"
    }
  } catch (error) {
    console.error(error)

    return {
      error: "Erro ao cancelar o agendamento"
    }
  }
}
