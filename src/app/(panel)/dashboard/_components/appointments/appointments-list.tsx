"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, X } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"

import { cancelAppointment } from "../../_actions/cancel-appointment"
import { Prisma } from "../../../../../../generated/prisma/browser"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { DialogAppointment } from "./dialog-appointment"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ButtonDatePicker } from "./button-date"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
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
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailAppointment, setDetailAppointment] = useState<AppointmentWithService | null>(null)

  const { data, isLoading, refetch } = useQuery({
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

      const json = await response.json() as AppointmentWithService[]
      return json
    },
    staleTime: 20000, // 20 seconds
    refetchInterval: 60000, // 60 seconds
  })

  const ocuppantMap: Record<string, AppointmentWithService> = {}

  if (data && data.length > 0) {
    for (const appointment of data) {
      const requiredSlot = Math.ceil(appointment.service.duration / 30);
      const startIndex = times.indexOf(appointment.time);

      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlot; i++) {
          const slotIndex = startIndex + i;

          if(slotIndex < times.length) {
            ocuppantMap[times[slotIndex]] = appointment;
          }
        }
      }
    }
  }

  async function handleCancelAppointment(appointmentId: string) {
    const response = await cancelAppointment({ appointmentId })

    if(response.error) {
      toast.error(response.error)
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["get-appointments"] })
    refetch()
    router.refresh()
    toast.success(response.data)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Agendamento
          </CardTitle>

          <ButtonDatePicker />
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              times.map((slot) => {
                const occupant = ocuppantMap[slot];

                if (!occupant) {
                  return (
                    <div
                      key={slot}
                      className="flex flex-row items-center py-2 border-t last:border-b"
                    >
                      <div className="w-16 text-sm font-semibold">{slot}</div>
                      <div
                        className="flex-1 text-sm text-gray-500"
                      >
                        Disponível
                      </div>
                    </div>
                  )
                };

                return (
                  <div
                    key={slot}
                    className="flex flex-row items-center py-2 border-t last:border-b"
                  >
                    <div className="w-16 text-sm font-semibold">{slot}</div>

                    <div className="flex-1 text-sm text-gray-500">
                      <div className="font-semibold">{occupant.name}</div>
                      <div className="text-sm text-gray-400">{occupant.phone}</div>
                    </div>

                    <div className="ml-auto">
                      <div className="flex gap-1">
                        <DialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() => setDetailAppointment(occupant)}
                            />
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </DialogTrigger>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => handleCancelAppointment(occupant.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogAppointment appointment={detailAppointment} />
    </Dialog>
  )
}
