import { redirect } from "next/navigation"

import { getSubscription } from "@/utils/get-subscription"
import { GridPlans } from "./_components/grid-plans"
import getSession from "@/lib/getSession"
import { SubscriptionDetails } from "./_components/subscription-details"

export default async function Plans() {
  const session = await getSession()
  if (!session) redirect("/")

  const subscription = await getSubscription({ userId: session?.user?.id })

  return (
    <div>
      {subscription?.status !== "active" && (
        <GridPlans />
      )}

      {subscription?.status === "active" && (
        <SubscriptionDetails subscription={subscription!} />
      )}
    </div>
  )
}
