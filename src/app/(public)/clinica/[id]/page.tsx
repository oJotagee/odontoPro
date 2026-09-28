import { redirect } from "next/navigation";

import { getInfoSchedule } from "./_data-access/get-info-schedule";
import { ScheduleContent } from "./_components/schedule-content";

export default async function SchedulePage({ params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const user = await getInfoSchedule({ useId: id });

  if(!user) redirect("/");
  
  return (
    <ScheduleContent clinic={user} />
  )
}