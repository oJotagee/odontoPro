"use server"

import { stripe } from "@/utils/stripe"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function createPortalCustomer() {
  const session = await auth()
  if (!session?.user?.id) {
    return {
      sessionId: "",
      error: "Usuario não autenticado"
    }
  }


  try {
    const user = await prisma.user.findFirst({
      where: {
        id: session.user.id
      }
    })
    if (!user) {
      return {
        sessionId: "",
        error: "Usuario não encontrado"
      }
    }

    const sessionId = user.stripe_customer_id
    if (!sessionId) {
      return {
        sessionId: "",
        error: "Sessão não encontrada"
      }
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sessionId,
      return_url: process.env.STRIPE_SUCCESS_URL as string,
    });

    return {
      sessionId: portalSession.url
    }
  } catch (error) {
    return {
      sessionId: "",
      error: "Erro ao criar sessão"
    }
  }
};
