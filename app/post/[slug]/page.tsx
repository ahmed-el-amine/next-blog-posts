import { getPostBySlugAction } from "@/actions/post.action";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import PostActions from "@/components/pages/post/PostActions";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const result = await getPostBySlugAction(slug);
  const session = await auth();

  if (!result.success || !result.post) {
    notFound();
  }

  const post = result.post;
  const isOwner = session?.user?.id === post.authorId;

  return (
    <article className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {isOwner && <PostActions postId={post.id} slug={post.slug} />}
        </div>
        <div className="flex items-center gap-3 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name || "Author"}
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <span>{post.author.name}</span>
          </div>
          <span>•</span>
          <time dateTime={post.createdAt.toISOString()}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        </div>
      </div>

      <div className="relative w-full h-[400px] mb-10">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover rounded-lg"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      <div className="mb-8 text-lg text-muted-foreground">
        {post.description}
      </div>

      <div className="prose prose-lg max-w-none">
        {/* You could use a markdown renderer here if your content is in markdown format */}
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}
