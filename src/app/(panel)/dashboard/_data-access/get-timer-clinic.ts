import prisma from "@/lib/prisma"

export async function getTimerClinic({ userId }: { userId: string }) {
  if(!userId) {
    return {
      times: [],
      userId: ""
    }  
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      },
      select: {
        id: true,
        times: true
      }
    })

    if(!user) {
      return {
        times: [],
        userId: ""
      }
    }

    return {
      times: user.times,
      userId: user.id,
    }
  } catch (error) {
    console.log(error)
    
    return {
      times: [],
      userId: ""
    }  
  }
}