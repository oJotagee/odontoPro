"use server"

import getSession from "@/lib/getSession"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateFormSchema = z.object({
  name: z.string().min(3, "Nome é obrigatório"),
  address: z.string().optional(),
  phone: z.string().optional(),
  status: z.boolean(),
  timeZone: z.string(),
  times: z.array(z.string())
})

type UpdateFormSchema = z.infer<typeof updateFormSchema>

export async function updateProfile(data: UpdateFormSchema) {
  const session = await getSession();
  if (!session?.user.id) return { error: "Usuário não encontrado" }
  
  const schema = updateFormSchema.safeParse(data)
  if (!schema.success) return { error: "Preencha todos os campos" }
  
  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        status: data.status,
        timeZone: data.timeZone,
        times: data.times
      }
    })

    revalidatePath("/dashboard/profile")

    return { data: "Clinica Atualizada com sucesso" }
  } catch (error) {
    console.log(error)
    return { error: "Ocorreu um erro ao atualizar o perfil" }
  }
}