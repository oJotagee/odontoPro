"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ReminderFormData, useReminderForm } from "./reminder-form"
import { createReminder } from "../../_actions/create-reminder"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { 
  Form, 
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"

interface ReminderContentProps {
  closeDialog: () => void
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {
  const form = useReminderForm()
  const router = useRouter()

  async function handleSubmit(formData: ReminderFormData) {
    const response = await createReminder({ description: formData.description })

    if (response.error) {
      toast.error(response.error)
      return;
    }

    toast.success(response.data)
    router.refresh()
    form.reset()
    closeDialog()
  }

  return (
    <div className="grid gap-4 py-4">
      <Form {...form}>
        <form 
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}  
        >
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Descreva o lembrete:</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field}
                    className="max-h-52 resize-none"
                  />
                </FormControl>
                <FormDescription>Digite seu nome completo.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="cursor-pointer"
            disabled={!form.watch("description")}
          >
            Cadastrar Lembrete
          </Button>
        </form>
      </Form>
    </div>
  )
}