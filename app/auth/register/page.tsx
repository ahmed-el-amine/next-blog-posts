import RegisterComponent from "@/components/pages/auth/register";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const RegisterPage = async () => {
  const session = await auth();
  if (session) return redirect("/");

  return (
    <div>
      <RegisterComponent />
    </div>
  );
};

export default RegisterPage;
