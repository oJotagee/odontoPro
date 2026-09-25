"use client"

import { useCallback, useState, useEffect } from "react"
import { MapPin } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAppointmentForm, AppointmentFormData } from "./schedule-form"
import { createNewAppointment } from "../_actions/create-appointment"
import { Prisma } from "../../../../../../generated/prisma/browser";
import { ScheduleTimesList } from "./schedule-times-list"
import { formatPhone } from "@/utils/formatPhone"
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "./date-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    services: true;
    subscription: true;
  }
}>;

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription
}

export interface TimeSlot {
  time: string
  isAvailable: boolean
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppointmentForm()
  const { watch } = form

  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimesSlots, setAvailableTimesSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [blockedTime, setBlockedTime] = useState<string[]>([])

  const selectedServiceId = watch("serviceId")
  const selectedDate = watch("date")

  const fetchBlockedTimes = useCallback(async (date: Date): Promise<string[]> => {
    setLoadingSlots(true)

    try {
      const dateString = date.toISOString().split("T")[0]

      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointments?userId=${clinic.id}&date=${dateString}`)

      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)

      return []
    } finally {
      setLoadingSlots(false)
    }
  }, [clinic.id])

  useEffect(() => {
    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTime(blocked)

        console.log(blocked)

        const times = clinic.times || []

        const finalSlots = times.map(time => ({
          time,
          isAvailable: !blocked.includes(time)
        }))

        setAvailableTimesSlots(finalSlots)

        const stillAvailableSlots = finalSlots.find(
          (slot) => slot.time === selectedTime && slot.isAvailable
        )

        if(!stillAvailableSlots) {
          setSelectedTime("")
        }
      })
    }
  }, [selectedDate, clinic.times, fetchBlockedTimes, selectedTime])

  async function handleRegisterAppointment(data: AppointmentFormData) {
    if(!selectedTime) {
      toast.error("Por favor, selecione um horário.");
      return;
    }

    const response = await createNewAppointment({
      name: data.name,
      email: data.email,
      phone: data.phone,
      time: selectedTime,
      date: data.date,
      serviceId: data.serviceId,
      clinicId: clinic.id
    })

    if (response.error) {
      toast.error(response.error)
      return
    }

    toast.success("Agendamento realizado com sucesso!")
    form.reset()
    setSelectedTime("")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-32 bg-emerald-500" />

      <section className="container mx-auto px-4 -mt-16">
        <div className="max-w-2xl mx-auto">
          <article className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-8">
              <Image 
                src={clinic.image ?? "/foto1.png"}
                alt="Foto da clinica"
                className="object-cover"
                fill
              />
            </div>

            <h1 className="text-2xl font-bold mb-2">{clinic.name}</h1>
            <div className="flex items-center gap-1">
              <MapPin  className="w-5 h-5" />
              <span>
                {clinic.address ? clinic.address : "Endereço não disponível"}
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className="max-w-2xl mx-auto w-full mt-6">
        <Form {...form}>
          <form 
            autoComplete="off"
            className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-md"
            onSubmit={form.handleSubmit(handleRegisterAppointment)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Nome:</FormLabel>
                  <FormControl>
                    <Input 
                      id="name"
                      autoComplete="name"
                      {...field} 
                      placeholder="Digite seu nome completo"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Email:</FormLabel>
                  <FormControl>
                    <Input 
                      id="email"
                      autoComplete="email"
                      {...field} 
                      placeholder="Digite seu email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Telefone:</FormLabel>
                  <FormControl>
                    <Input 
                      id="phone"
                      autoComplete="tel"
                      {...field} 
                      placeholder="(XX) XXXXX-XXXX"
                      onChange={(e) => {
                        const formattedPhone = formatPhone(e.target.value)

                        field.onChange(formattedPhone)
                      }} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-1">
                  <FormLabel className="font-semibold">Data do agendamento:</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      initialDate={new Date()}
                      className="w-full rounded border p-2"
                      onChange={(date) => {
                        if(date) {
                          field.onChange(date)
                          setSelectedTime("")
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-1">
                  <FormLabel className="font-semibold">Serviço:</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedTime("")
                      }}
                      items={clinic.services.map(service => ({
                        value: service.id,
                        label: `${service.name} - (${Math.floor(service.duration / 60)}h ${service.duration % 60}min)`,
                      }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinic.services.map(service => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} - ({Math.floor(service.duration / 60)}h {service.duration % 60}min)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedServiceId && (
              <div className="space-y-2">
                <Label className="font-semibold">Horários disponíveis:</Label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {loadingSlots ? (
                    <p>Carregando horários...</p>
                  ) : availableTimesSlots.length === 0 ? (
                    <p>Não há horários disponíveis.</p>
                  ) : (
                    <ScheduleTimesList
                      clinicTimes={clinic.times}
                      blockedTimes={blockedTime}
                      availableTimesSlots={availableTimesSlots}
                      selectedTime={selectedTime}
                      selectedDate={selectedDate}
                      requiredSlots={
                        clinic.services.find(service => service.id === selectedServiceId) 
                          ? Math.ceil(clinic.services.find(service => service.id === selectedServiceId)!.duration / 30) 
                          : 1
                      }
                      onSelectTime={(time) => setSelectedTime(time)}
                    />
                  )}
                </div>
              </div>
            )}

            {clinic.status ? (
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 cursor-pointer"
                disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("serviceId") || !watch("date")}
              >
                Realizar agendamento
              </Button>
            ) : (
              <p className="text-center bg-red-500 text-white rounded-md px-4 py-2">Clínica fechada</p>
            )}
          </form>
        </Form>
      </section>
    </div>
  )
}