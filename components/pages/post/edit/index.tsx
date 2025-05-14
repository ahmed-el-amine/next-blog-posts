"use client";

import { updatePostAction } from "@/actions/post.action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { postUpdateSchema } from "@/lib/zod/postSchema.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type PostType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
};

interface EditPostFormProps {
  post: PostType;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(post.image);

  const form = useForm<z.infer<typeof postUpdateSchema>>({
    resolver: zodResolver(postUpdateSchema),
    defaultValues: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Set value in form
    form.setValue("image", file);
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

  const onSubmit = async (data: z.infer<typeof postUpdateSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("description", data.description);
      formData.append("content", data.content);

      // Only append image if a new one was selected
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      const result = await updatePostAction(formData);

      if (result.success) {
        router.push(`/post/${data.slug}`);
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-[500px]"
      >
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Post title"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Auto-generate slug when title changes if slug is empty
                        if (!form.getValues("slug")) {
                          form.setValue("slug", generateSlug(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="post-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL-friendly version of the title.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your post"
                      className="resize-none h-32"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Featured Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty to keep the current image.
                  </FormDescription>
                  <FormMessage />
                  {preview && (
                    <div className="mt-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-48 object-cover rounded-md"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your post content here..."
                    className="h-[300px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
