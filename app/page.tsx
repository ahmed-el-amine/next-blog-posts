"use client";

import { getPostsAction } from "@/actions/post.action";
import PostCard from "@/components/pages/post/PostCard";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const session = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (pageNum = 1) => {
    if (loading) return;

    setLoading(true);
    try {
      const result = await getPostsAction(pageNum);

      if (result.success) {
        if (pageNum === 1) {
          setPosts(result.posts);
        } else {
          setPosts((prev) => [...prev, ...result.posts]);
        }
        setHasMore(result.hasMore);
      } else {
        console.error("Failed to load posts");
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load initial posts
  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  // Load more posts when page changes
  useEffect(() => {
    if (page > 1) {
      loadPosts(page);
    }
  }, [page]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest Posts</h1>

        {session.data && (
          <Button asChild>
            <a href="/post/create">Create Post</a>
          </Button>
        )}
      </div>

      {posts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">No posts found</h2>

          {session.data && (
            <>
              <p className="text-muted-foreground mb-6">
                Be the first to create a post!
              </p>
              <Button asChild>
                <a href="/post/create">Create Post</a>
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {loading && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-muted-foreground mt-8">
              You've reached the end!
            </p>
          )}
        </>
      )}
    </div>
  );
}
