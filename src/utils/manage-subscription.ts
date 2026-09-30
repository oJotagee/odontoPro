import Stripe from "stripe";

import { SubscriptionPlan } from "../../generated/prisma/enums";
import { stripe } from "@/utils/stripe";
import prisma from "@/lib/prisma";

/**
 * Salvar, atualizar ou deletar informacoes das assinaturas no banco de dados sincronizando com o stripe
 *
 * @async
 * @function manageSubscription
 * @param {string} subscriptionId
 * @param {string} customerId
 * @param {boolean} createAction
 * @param {boolean} deleteAction
 * @param {SubscriptionPlan} [type]
 *
 * @returns {Promise<Response|void>}
 */
export async function manageSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
  deleteAction = false,
  type?: SubscriptionPlan
) {
  const findUser = await prisma.user.findFirst({
    where: {
      stripe_customer_id: customerId,
    },
  });

  if (!findUser) {
    return Response.json({
      error: "Falha ao realizar assinatura",
      status: 400
    });
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: findUser.id,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    plan: type ?? "BASIC",
  }

  // Deletar a assinatura se deleteAction for true
  if(subscriptionId && deleteAction) {
    await prisma.subcription.delete({
      where: {
        id: subscriptionId,
      },
    });

    return;
  }

  // Criar ou atualizar a assinatura
  if (createAction) {
    try {
      await prisma.subcription.create({
        data: subscriptionData,
      });
    } catch (error) {
      console.error(error);
    }

    return;
  } else {
    try {
      const findSubscription = await prisma.subcription.findFirst({
        where: {
          id: subscriptionId,
        },
      });

      if(!findSubscription) return;

      await prisma.subcription.update({
        where: {
          id: subscriptionId,
        },
        data: {
          status: subscription.status,
          priceId: subscription.items.data[0].price.id
        }
      });
    } catch (error) {
      console.error(error);
      console.log("FALHA AO ASSINAR");
    }
  }
}
