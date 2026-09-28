"use client"

import { useRouter } from "next/navigation"
import { Plus, Trash } from "lucide-react"
import { toast } from "sonner"

import { deleteReminder } from "@/app/(panel)/dashboard/_actions/delete-reminder"
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card"
import { Reminder } from "../../../../../../generated/prisma/browser"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ReminderContent } from "./reminder-content"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription 
} from "@/components/ui/dialog"
import { useState } from "react"

interface ReminderListProps {
  reminders: Reminder[]
}

export function ReminderList({ reminders }: ReminderListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  async function handleDeleteReminder(id: string) {
    const response = await deleteReminder({ reminderId: id })

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success(response.data)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">  
          <CardTitle className="text-xl md:text-2xl font-bold">
            Lembretes
          </CardTitle>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-9 p-0 cursor-pointer"
                />
              }
            >
              <Plus className="h-5 w-5" />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Novo lembrete
                </DialogTitle>
                <DialogDescription>
                  Criar um novo lembrete.
                </DialogDescription>
              </DialogHeader>

              <ReminderContent closeDialog={() => setIsOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {reminders.length === 0 && (
            <p className="text-sm text-gray-500">
              Nenhum lembrete encontrado.
            </p>
          )}
            
          <ScrollArea className="h-[340px] lg:max-h-[calc(100vh-15rem)] pr-0 w-full flex-1">
            {reminders.map((item) => (
              <article 
              key={item.id}
                className="flex flex-wrap flex-row items-center justify-between py-2 bg-yellow-100 mb-2 px-2 rounded-md" 
              >
                <p className="text-sm lg:text-base">{item.description}</p>
                <Button
                  className="bg-red-500 hover:bg-red-600 shadow-none cursor-pointer rounded-full p-2"
                  size="sm"
                  onClick={() => handleDeleteReminder(item.id)}
                >
                  <Trash className="h-4 w-4 text-white" />
                </Button>
              </article>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

    </div>
  )
}