"use server"

import prisma from "@/lib/prisma"

export async function getInfoSchedule({ useId }: {useId: string}) {
  try {
    if(!useId) return null;

    const user = await prisma.user.findFirst({
      where: {
        id: useId
      },
      include: {
        subscription: true,
        services: {
          where: {
            status: true  
          }
        },
      }
    })

    if(!user) return null;
    
    return user;
  } catch (error) {
    console.error(error);
    
    return null;
  }
}