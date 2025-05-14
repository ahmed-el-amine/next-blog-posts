"use server";

import { auth } from "@/lib/auth";
import { postCreateSchema, postUpdateSchema } from "@/lib/zod/postSchema.zod";
import db from "@/prisma/db";

// Helper function to convert File to base64 string
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export async function createPostAction(data: FormData) {
  // Get current user
  const session = await auth();

  if (!session || !session.user) {
    return {
      success: false,
      message: "You must be logged in to create a post",
    };
  }

  // Convert FormData to object
  const rawData = {
    title: data.get("title") as string,
    slug: data.get("slug") as string,
    description: data.get("description") as string,
    content: data.get("content") as string,
    image: data.get("image") as File,
  };

  // Validate data
  const validationResult = postCreateSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: validationResult.error.format(),
    };
  }

  try {
    // Convert image to base64 string
    const imageBase64 = await fileToBase64(rawData.image);

    await db.post.create({
      data: {
        title: rawData.title,
        slug: rawData.slug,
        description: rawData.description,
        content: rawData.content,
        image:
          "https://www.pngmart.com/files/3/Vector-PNG-Transparent-Image.png",
        authorId: session.user.id!,
      },
    });

    return {
      success: true,
      message: "Post created successfully",
    };
  } catch (error) {
    console.error("Error creating post:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: `Failed to create post: ${error.message}`,
      };
    }

    return {
      success: false,
      message: "Failed to create post",
    };
  }
}

export async function getPostsAction(page = 1, limit = 5) {
  try {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get posts with pagination
    const posts = await db.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Get total count for pagination
    const totalPosts = await db.post.count();

    return {
      success: true,
      posts,
      hasMore: skip + posts.length < totalPosts,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      success: false,
      posts: [],
      hasMore: false,
    };
  }
}

export async function getPostBySlugAction(slug: string) {
  try {
    const post = await db.post.findUnique({
      where: {
        slug,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
        post: null,
      };
    }

    return {
      success: true,
      post,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      success: false,
      message: "Failed to fetch post",
      post: null,
    };
  }
}

export async function deletePostAction(postId: string) {
  // Get current user
  const session = await auth();

  if (!session || !session.user) {
    return {
      success: false,
      message: "You must be logged in to delete a post",
    };
  }

  try {
    // First check if the post exists and belongs to the current user
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Verify ownership
    if (post.authorId !== session.user.id) {
      return {
        success: false,
        message: "You don't have permission to delete this post",
      };
    }

    // Delete the post
    await db.post.delete({
      where: { id: postId },
    });

    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      message: "Failed to delete post",
    };
  }
}

export async function updatePostAction(data: FormData) {
  // Get current user
  const session = await auth();

  if (!session || !session.user) {
    return {
      success: false,
      message: "You must be logged in to update a post",
    };
  }

  // Convert FormData to object
  const rawData = {
    id: data.get("id") as string,
    title: data.get("title") as string,
    slug: data.get("slug") as string,
    description: data.get("description") as string,
    content: data.get("content") as string,
    // image: data.get("image") as File | null,
  };

  // Validate data
  const validationResult = postUpdateSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: validationResult.error.format(),
    };
  }

  try {
    // Get the post to check ownership
    const post = await db.post.findUnique({
      where: { id: rawData.id },
      select: { authorId: true },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Check if the current user is the author
    if (post.authorId !== session.user.id) {
      return {
        success: false,
        message: "You don't have permission to update this post",
      };
    }

    // Prepare update data
    const updateData: any = {
      title: rawData.title,
      slug: rawData.slug,
      description: rawData.description,
      content: rawData.content,
    };

    // Only update image if a new one was provided
    // if (rawData.image && rawData.image.size > 0) {
    //   // Convert image to base64 string or handle upload
    //   // For simplicity, we're using a placeholder image here
    //   updateData.image =
    //     "https://www.pngmart.com/files/3/Vector-PNG-Transparent-Image.png";

    //   // In a real app, you would handle the image upload here
    //   // const imageBase64 = await fileToBase64(rawData.image);
    //   // updateData.image = imageBase64;
    // }

    // Update the post
    await db.post.update({
      where: { id: rawData.id },
      data: updateData,
    });

    return {
      success: true,
      message: "Post updated successfully",
    };
  } catch (error) {
    console.error("Error updating post:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: `Failed to update post: ${error.message}`,
      };
    }

    return {
      success: false,
      message: "Failed to update post",
    };
  }
}
