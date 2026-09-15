"use server"

import prisma from "@/lib/prisma"

interface UserData {
  id: string
}

export async function getUserData({ id }: UserData) {
  try {
    if(!id) return null

    const user = await prisma.user.findFirst({
      where: {
        id: id
      },
      include: {
        subscription: true
      }
    })

    if(!user) return null

    return user
  } catch (error) {
    console.error(error)

    return null
  }
}