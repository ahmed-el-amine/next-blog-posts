import { getPostBySlugAction } from "@/actions/post.action";
import EditPostForm from "@/components/pages/post/edit";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

interface EditPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const result = await getPostBySlugAction(slug);
  const session = await auth();

  if (!result.success || !result.post) {
    notFound();
  }

  // Check if the current user is the author
  if (session?.user?.id !== result.post.authorId) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <EditPostForm post={result.post} />
    </div>
  );
}
