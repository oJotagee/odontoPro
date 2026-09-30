"use client"

import { toast } from "sonner";

import { SubscriptionPlan } from "../../../../../../generated/prisma/enums";
import { createSubscription } from "../_actions/create-subscription";
import { Button } from "@/components/ui/button";
import { getStripeJs } from "@/utils/stripe-js"

interface SubscriptionButtonProps {
  type: SubscriptionPlan
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  async function handleCreateBilling() {
    const { sessionId, error, url } = await createSubscription({ type })

    if (error) {
      toast.error(error);
      return;
    }

    const stripe = await getStripeJs();

    if (stripe && url) {
      // await stripe.redirectToCheckout({ sessionId: sessionId });
      window.location.href = url;
    }
  }

  return (
    <Button
      className={`w-full cursor-pointer ${type === "PROFESSIONAL" && "bg-emerald-500 hover:bg-emerald-600"} cursor-pointer`}
      onClick={handleCreateBilling}
    >
      Ativar assinatura
    </Button>
  );
}
