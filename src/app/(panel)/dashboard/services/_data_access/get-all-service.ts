"use server"

import prisma from "@/lib/prisma"

export async function getAllService({userId}: {userId: string}) {
  if(!userId) throw new Error("Falha ao obter todos os serviços: userId não fornecido");

  try {
    const services = await prisma.service.findMany({
      where: {
        userId: userId,
        status: true
      }
    });

    return {
      data: services
    }
  } catch (error) {
    throw new Error("Falha ao obter todos os serviços: userId não fornecido") 
  }
} 