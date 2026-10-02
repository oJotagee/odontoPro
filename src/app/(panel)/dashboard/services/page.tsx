import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ServiceContent } from "./_components/service-content"
import getSession from "@/lib/getSession"

export default async function Services() {
  const session = await getSession();
  if(!session) redirect("/")

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ServiceContent userId={session.user?.id} />
    </Suspense>
  )
}
