"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { z } from "zod"

import { auth } from "@/lib/auth"

const formSchema = z.object({
  description: z.string().min(1, "A descrição do lembrete é obrigatório")
})

export type FormSchema = z.infer<typeof formSchema>

export async function createReminder(formData: FormSchema) {
  const schema = formSchema.safeParse(formData)
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }  
  }

  const session = await auth()
  if(!session?.user) {
    return {
      error: "Usuário não autenticado"
    }
  }

  try {
    await prisma.reminder.create({
      data: {
        description: formData.description,
        userId: session?.user?.id
      }
    })

    revalidatePath("/dashboard")

    return {
      data: "Lembrete cadastrado com sucesso"
    }
  } catch (error) {
    return {
      error: "Erro ao cadastrar o lembrete"
    }  
  }
}