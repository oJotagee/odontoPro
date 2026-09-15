import { redirect } from "next/navigation"

import getSession from "@/lib/getSession"

export default async function Dashboard() {
  const session = await getSession()
  if(!session) redirect("/")

  return <div>Dashboard Page</div>
}