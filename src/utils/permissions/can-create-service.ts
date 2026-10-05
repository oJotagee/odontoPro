"use server"

import { Session } from "next-auth";

import { checkSubscriptionExpired } from "@/utils/permissions/check-subscription-expired";
import { Subcription } from "../../../generated/prisma/client";
import { ResultPermissionProp } from "./can-permission";
import { getPlan } from "./get-plans";
import prisma from "@/lib/prisma";
import { PLANS } from "../plans";

export async function canCreateService(subscription: Subcription | null, session: Session): Promise<ResultPermissionProp> {
  try {
    const serviceCount = await prisma.service.count({
      where: {
        userId: session?.user?.id,
        status: true,
      }
    });

    if (subscription && subscription.status === "active") {
      const plan = subscription.plan;
      const planLimit = await getPlan(plan)

      return {
        hasPermission: planLimit.maxServices === null || serviceCount < planLimit.maxServices,
        planId: subscription.plan,
        expired: false,
        plan: PLANS[subscription.plan]
      }
    }

    const checkUserLimit = await checkSubscriptionExpired(session);

    return checkUserLimit
  } catch (error) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null
    }
  }
}
