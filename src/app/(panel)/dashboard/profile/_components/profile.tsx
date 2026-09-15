"use client"

import { ArrowRight } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { cn } from "cn"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { extractPhoneNumber, formatPhone } from "@/utils/formatPhone"
import { ProfileFormData, useProfileForm } from "./profile-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"

import { Prisma } from "../../../../../../generated/prisma/browser"
import { updateProfile } from "../_actions/update-profile"
import imgTest from "../../../../../../public/foto1.png"

type UserWithSub = Prisma.UserGetPayload<{
  include: {
    subscription: true
  }
}>

interface ProfileContentProps {
  user: UserWithSub
}

export function ProfileContent({ user }: ProfileContentProps) {
  const profileForm = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timeZone,
  })

  const [selectedHour, setSelectedHour] = useState<string[]>(user.times || []) 
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  function generateTimeSlots(): string[] {
    const hours: string[] = []

    for (let hour = 8; hour <= 24; hour++) {
      const formattedHour = hour.toString().padStart(2, "0")

      for (let minutes = 0; minutes < 2; minutes++) {
        const formattedMinutes = (minutes * 30).toString().padStart(2, "0")

        hours.push(`${formattedHour}:${formattedMinutes}`)
      }
    }

    return hours
  }

  const hours = generateTimeSlots();

  function toggleHour(hour: string) {
    setSelectedHour((prev) => {
      return prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour].sort()
    })
  }

  const timeZones = Intl.supportedValuesOf("timeZone").filter((zone) => 
    zone.startsWith("America/Sao_Paulo") ||
    zone.startsWith("America/Fortaleza") ||
    zone.startsWith("America/Recife") ||
    zone.startsWith("America/Bahia") ||
    zone.startsWith("America/Belem") ||
    zone.startsWith("America/Manaus") ||
    zone.startsWith("America/Cuiaba")
  )

  async function onSubmit(values: ProfileFormData) {
    const response = await updateProfile({
      name: values.name,
      address: values.address,
      status: values.status === "Ativo" ? true : false,
      timeZone: values.timeZone,
      phone: values.phone,
      times: selectedHour || []
    })
    
    if(response.error) {
      toast.error(response.error)
      return;
    }

    toast.success(response.data)
  }

  return (
    <div className="mx-auto">
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <div className="bg-gray-200 relative w-40 h-40 rounded-full overflow-hidden">
                  <Image 
                    src={user.image ? user.image : imgTest} 
                    alt="Profile Picture" 
                    fill
                    className="object-cover" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Nome:</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Digite seu nome completo.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Endereço:</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Digite seu endereço completo.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Celular:</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          onChange={(e) => {
                            const formattedPhone = formatPhone(e.target.value)

                            field.onChange(formattedPhone)
                          }} 
                        />
                      </FormControl>
                      <FormDescription>Digite seu número de celular.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Status:</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          defaultValue={field.value ? "Ativo" : "Inativo"}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione seu status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Digite seu status atual.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label className="font-semibold">Configurar horarios:</Label>
                  <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger
                      render={
                        <Button 
                          variant={"outline"}
                          className="w-full justify-between"
                        />
                      }
                    >
                      Clique aqui para selecionar horario
                      <ArrowRight className="w-5 h-5" />
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Selecionar Horario</DialogTitle>
                        <DialogDescription>Escolha os horarios desejados.</DialogDescription>
                      </DialogHeader>

                      <section className="py-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          Clique nos horarios abaixo para marcar ou desmarcar.
                        </p>

                        <div className="grid grid-cols-5 gap-2">
                          {hours.map((hour) => (
                            <Button
                              key={hour}
                              variant={"outline"}
                              className={cn(
                                "border-2 rounded h-10",
                                selectedHour.includes(hour) && "border-emerald-500 text-primary"
                              )}
                              onClick={() => toggleHour(hour)}
                            >
                              {hour}
                            </Button>
                          ))}
                        </div>
                      </section>

                      <Button className="w-full" onClick={() => setDialogIsOpen(false)}>
                        Fechar
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                <FormField
                  control={profileForm.control}
                  name="timeZone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Fuso Horário:</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          defaultValue={field.value ? "GMT-3" : "GMT-4"}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione seu fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeZones.map((zone) => (
                              <SelectItem key={zone} value={zone}>
                                {zone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Selecione seu fuso horário atual.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  Salvar alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}