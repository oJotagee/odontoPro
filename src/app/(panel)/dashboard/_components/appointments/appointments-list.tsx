"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
} from "@/components/ui/card"
import { Prisma } from "../../../../../../generated/prisma/browser"

type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true
  }
}>

interface AppointmentsListProps {
  times: string[]
}

export function AppointmentsList({ times }: AppointmentsListProps) {
  const searchParams = useSearchParams()
  const date = searchParams.get("date")
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async (): Promise<AppointmentWithService[]> => {
      let activeDate = date
      if(!activeDate) {
        const today = format(new Date(), "yyyy-MM-dd")
        activeDate = today
      }

      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointments?date=${activeDate}`

      const response = await fetch(url)
      if(!response.ok) {
        return []
      }

      const json = await response.json()
      return json
    }
  })
  console.log(data)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl md:text-2xl font-bold">
          Agendamento
        </CardTitle>

        <button>
          Selecionar Data
        </button>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
          {times.map((slot) => {
            
            return (
              <div 
                key={slot}
                className="flex flex-row items-center py-2 border-t last:border-b"
              >
                <div className="w-16 text-sm font-semibold">{slot}</div>
                <div
                  className="flex-1 text-sm text-gray-400"
                >
                  Disponível
                </div>
              </div>
            )
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}