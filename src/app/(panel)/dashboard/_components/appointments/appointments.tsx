import { getTimerClinic } from "@/app/(panel)/dashboard/_data-access/get-timer-clinic"
import { AppointmentsList } from "./appointments-list"

export async function Appointments({ userId }: { userId: string }) {
  const { times } = await getTimerClinic({ userId })

  return (
    <AppointmentsList times={times} />
  )
}