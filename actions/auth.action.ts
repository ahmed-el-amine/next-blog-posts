"use server";

import { signIn, signOut } from "@/lib/auth";
import { userLoginSchema, userRegisterSchema } from "@/lib/zod/userSchema.zod";
import db from "@/prisma/db";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const Logout = async () => {
  await signOut({ redirect: false });

  redirect("/auth/signin");
};

export const SignInGithubAction = async () => {
  let authUrl = null;
  try {
    authUrl = await signIn("github", { redirect: false });
  } catch (error) {}

  if (authUrl) {
    return redirect(authUrl);
  }

  return {
    success: false,
    message: "Sign in failed",
  };
};

export const SignInGoogleAction = async () => {
  let authUrl = null;
  try {
    authUrl = await signIn("google", { redirect: false });
  } catch (error) {}

  if (authUrl) {
    return redirect(authUrl);
  }

  return {
    success: false,
    message: "Sign in failed",
  };
};

export const RegisterCredentialsAction = async (
  data: z.infer<typeof userRegisterSchema>
) => {
  // validate the data
  const { success } = userRegisterSchema.safeParse(data);

  if (!success) {
    return {
      success: false,
      message: "Invalid data",
    };
  }

  try {
    // check if email exist
    const userExist = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExist) {
      return {
        success: false,
        message: "This Email Already Exist",
      };
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: data.password,
      redirect: false,
    });
  } catch (error) {
    return {
      success: false,
      message: "Sign in failed",
    };
  }

  redirect("/");
};

export const SignInCredentialsAction = async (
  data: z.infer<typeof userLoginSchema>
) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    console.log(key, value);

    formData.append(key, value);
  }

  try {
    await signIn("credentials", { ...data, redirect: false });
  } catch (error) {
    return {
      success: false,
      message: "Email or password is incorrect",
    };
  }

  redirect("/");
};
