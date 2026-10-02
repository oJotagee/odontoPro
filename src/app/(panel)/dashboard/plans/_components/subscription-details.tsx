"use client"

import { Subcription as Subscription } from "../../../../../../generated/prisma/browser"
import { toast } from "sonner"

import { createPortalCustomer } from "../_actions/create-portal-customer"
import { subscriptionPlans } from "@/utils/plans/index"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"

interface SubscriptionDetailsProps {
  subscription: Subscription
}

export function SubscriptionDetails({ subscription }: SubscriptionDetailsProps) {
  const subscriptionInfo = subscriptionPlans.find((plan) => plan.id === subscription.plan);

  async function handleManageSubscription() {
    const response = await createPortalCustomer()
    if (response.error) {
      toast.error(response.error)
      return
    }

    window.location.href = response.sessionId
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Seu Plano Atual</CardTitle>
        <CardDescription>Sua assinatura esta ativa!</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg md:text-xl">
            {subscription.plan === "BASIC" ? "Básico" : "Profissional"}
          </h3>

          <div className="bg-green-500 text-white w-fit px-4 py-1 rounded-md">
            {subscription.status === "active" ? "Ativo" : "Inativo"}
          </div>
        </div>

        <ul className="list-disc list-inside space-y-2">
          {subscriptionInfo && subscriptionInfo.features.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleManageSubscription}
          className="cursor-pointer"
        >
          Gerenciar Assinatura
        </Button>
      </CardFooter>
    </Card>
  )
}
