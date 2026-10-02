"use server"

import { PlanDetailInfo } from "./get-plans";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { canCreateService } from "./can-create-service";

export type PLAN_PROP = "BASIC" | "PROFESSIONAL" | "TRIAL" | "EXPIRED"

type TypeCheck = "service"

interface CanPermissionProps {
  type: TypeCheck
}

export interface ResultPermissionProp {
  hasPermission: boolean
  planId: PLAN_PROP
  expired: boolean
  plan: PlanDetailInfo | null
}

export async function canPermission({ type }: CanPermissionProps): Promise<ResultPermissionProp> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null
    }
  }

  try {
    const subscription = await prisma.subcription.findFirst({
      where: {
        userId: session?.user?.id
      }
    })
    if(!subscription) {
      return {
        hasPermission: false,
        planId: "EXPIRED",
        expired: true,
        plan: null
      }
    }

    switch (type) {
      case "service": {
        const permissions = await canCreateService(subscription, session)

        return permissions
      }
      default: {
        return {
          hasPermission: false,
          planId: "EXPIRED",
          expired: true,
          plan: null
        }
      }
    }
  } catch (error) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null
    }
  }
}
