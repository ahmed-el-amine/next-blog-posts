import SignInComponent from "@/components/pages/auth/signin";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const SignInPage = async () => {
  const session = await auth();
  if (session) return redirect("/");

  return (
    <div>
      <SignInComponent />
    </div>
  );
};

export default SignInPage;
