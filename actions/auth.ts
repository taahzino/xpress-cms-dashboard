"use server";

import { signIn, signOut } from "@/lib/auth";
import x_axios from "@/lib/axios";
import { cookies } from "next/headers";

export async function auth_login(email: string, password: string) {
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

export async function auth_logout() {
  try {
    await signOut();

    cookies().delete("jwt");
    cookies().delete("profile");

    return { success: true };
  } catch (error) {
    console.log("Logout failed:", error);

    return { success: false, error: "Logout failed" };
  }
}

export async function auth_reset_request(email: string) {
  try {
    const response = await x_axios.post("/auth/people/reset/request", {
      email,
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        error: error.response.data.errors[0].message,
      };
    } else if (error.response?.data?.message) {
      return { success: false, error: error.response.data.message };
    } else {
      return { success: false, error: "An error occurred" };
    }
  }
}

export async function auth_reset_verify(email: string, otp: string) {
  try {
    const response = await x_axios.post("/auth/people/reset/verify", {
      email,
      otp,
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        error: error.response.data.errors[0].message,
      };
    } else if (error.response?.data?.message) {
      return { success: false, error: error.response.data.message };
    } else {
      return { success: false, error: "An error occurred" };
    }
  }
}

export async function auth_reset_perform(
  email: string,
  password: string,
  token: string
) {
  try {
    const response = await x_axios.post("/auth/people/reset/perform", {
      email,
      token,
      password,
    });

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.data?.errors) {
      return {
        success: false,
        error: error.response.data.errors[0].message,
      };
    } else if (error.response?.data?.message) {
      return { success: false, error: error.response.data.message };
    } else {
      return { success: false, error: "An error occurred" };
    }
  }
}
