import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreatePostForm from "@/components/pages/post/create";

export default async function CreatePostPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex flex-wrap justify-center py-10">
      <CreatePostForm />
    </div>
  );
}
