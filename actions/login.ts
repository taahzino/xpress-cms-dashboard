"use server";

import { signIn } from "@/lib/auth";
import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
  try {
    const data = await signIn({ email, password });

    if (data.user) {
      const token = data.user.token;

      cookies().set("jwt", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (data?.user?.profile) {
        cookies().set("profile", JSON.stringify(data.user.profile), {
          httpOnly: true,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      return { success: true, user: data.user };
    }

    return { success: false, error: "Invalid email or password" };
  } catch (error) {
    return { success: false, error: "Login failed" };
  }
}
