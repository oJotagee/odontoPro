"use server"

import { signIn } from "@/lib/auth"

type loginType = "github" | "google"

export async function handleRegister(provider: loginType) {
  await signIn(provider, { redirectTo: "/dashboard" })
}
