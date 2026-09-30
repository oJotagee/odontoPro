"use server"

import prisma from "@/lib/prisma"

export async function getSubscription({ userId }: { userId: string }) {
  if(!userId) return null

  try {
    const subscription = await prisma.subcription.findFirst({
      where: {
        userId,
      },
    })

    return subscription
  } catch {
    return null
  }
}
