"use client";
import PostActions from "@/components/pages/post/PostActions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    createdAt: Date;
    authorId: string;
    author: {
      name: string | null;
      image: string | null;
    };
  };
};

// Remove the async keyword here
export default function PostCard({ post }: PostCardProps) {
  const session = useSession();

  const isOwner = session.data?.user?.id === post.authorId;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.author.image && (
              <Image
                src={post.author.image}
                alt={post.author.name || "Author"}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <span>{post.author.name}</span>
            <span>•</span>
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
          {isOwner && <PostActions postId={post.id} slug={post.slug} />}
        </div>
        <Link href={`/post/${post.slug}`}>
          <h3 className="text-xl font-semibold hover:underline mb-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-2">{post.description}</p>
        <Link
          href={`/post/${post.slug}`}
          className="mt-4 inline-block text-sm font-medium hover:underline"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
