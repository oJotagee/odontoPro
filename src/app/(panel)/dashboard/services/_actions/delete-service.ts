"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const formSchema = z.object({
  serviceId: z.string().min(1, "O ID do serviço é obrigatório")
});

type formSchema = z.infer<typeof formSchema>;

export async function deleteService({ serviceId }: formSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Falha ao deletar serviço"
    }
  }

  const schema = formSchema.safeParse({ serviceId });

  if(!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    await prisma.service.update({
      where: {
        id: serviceId,
        userId: session.user.id,
      },
      data: {
        status: false
      },
    });

    revalidatePath("/dashboard/services"); 
  
    return {
      data: "Servico deletado com sucesso"
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Falha ao deletar serviço"
    }
  }
}