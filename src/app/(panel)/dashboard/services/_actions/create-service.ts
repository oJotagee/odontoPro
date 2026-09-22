"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  price: z.number().min(1, "O preço é obrigatório"),
  duration: z.number()
});

type formSchema = z.infer<typeof formSchema>;

export async function CreateNewService(data: formSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastrar serviço"
    }
  }

  const schema = formSchema.safeParse(data);

  if(!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/services"); 
  
    return {
      data: service
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Falha ao cadastrar serviço"
    }
  }
}