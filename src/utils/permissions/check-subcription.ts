"use server"

import { addDays, isAfter, differenceInDays } from "date-fns"

import { TRIAL_DAYS } from "./trial-limit"
import prisma from "@/lib/prisma"

export async function checkSubscription(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    },
    include: {
      subscription: true
    }
  })
  if (!user) {
    throw new Error("Usuario nao encontrado")
  }

  if (user.subscription && user.subscription.status === "active") {
    return {
      subscriptionStatus: "ACTIVE",
      message: "Assinatura ativa.",
      planId: user.subscription.plan
    }
  }

  const trialEndDate = addDays(user.createdAt, TRIAL_DAYS)

  if(isAfter(new Date(), trialEndDate)) {
    return {
      subscriptionStatus: "EXPIRED",
      message: "Seu período de teste expirou.",
      planId: "TRIAL"
    }
  }

  const daysLeft = differenceInDays(trialEndDate, new Date())

  return {
    subscriptionStatus: "TRIAL",
    message: `Você está em período de teste. ${daysLeft} dias restantes.`,
    planId: "TRIAL"
  }
}
