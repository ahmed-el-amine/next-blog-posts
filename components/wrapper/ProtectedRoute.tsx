import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const session = auth();
  if (!session) redirect("/auth/signin");

  return children;
};

export default ProtectedRoute;
