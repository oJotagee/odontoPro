import { NextResponse, NextRequest } from "next/server"

import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const userId = searchParams.get("userId")
  const dateParam = searchParams.get("date")

  if(!userId || userId === "null" || !dateParam || dateParam === "null") {
    return NextResponse.json({
      error: "Nenhum agendamento encontrado",
    }, {
      status: 400 // Bad Request
    })
  }

  try {
    const [year, month, day] = dateParam.split("-").map(Number)
    const starDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59))

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return NextResponse.json({
        error: "Usuário não encontrado",
      }, {
        status: 404 // Not Found
      })
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        appointmentDate: {
          gte: starDate,
          lte: endDate,
        },
      },
      include: {
        service: true
      }
    })

    const blockedTimes = new Set<string>()

    for(const apt of appointments) {
      const requiredSlots = Math.ceil(apt.service.duration / 30)
      const startIndex = user.times.indexOf(apt.time)

      if(startIndex !== -1) {
        for(let i = 0; i < requiredSlots; i++) {
          const timeSlot = user.times[startIndex + i]

          if(timeSlot) {
            blockedTimes.add(timeSlot)
          }
        }
      }
    }

    const blockedTime = Array.from(blockedTimes)

    return NextResponse.json(blockedTime)
  } catch (error) {
    console.error(error)

    return NextResponse.json({
      error: "Erro ao buscar agendamentos"
    }, {
      status: 500 // Internal Server Error
    })
  }
}
