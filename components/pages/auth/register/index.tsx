"use client";

import { RegisterCredentialsAction } from "@/actions/auth.action";
import OAuthButtons from "@/components/pages/auth/OAuthButtons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userRegisterSchema } from "@/lib/zod/userSchema.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const RegisterComponent = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof userRegisterSchema>>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(userRegisterSchema),
  });

  const action: () => void = form.handleSubmit(async (data) => {
    const response = await RegisterCredentialsAction(data);
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-xs w-full flex flex-col items-center">
        <OAuthButtons />

        <div className="my-7 w-full flex items-center justify-center overflow-hidden">
          <Separator />
          <span className="text-sm px-2">OR</span>
          <Separator />
        </div>

        <Form {...form}>
          <form
            ref={formRef}
            className="w-full space-y-4"
            action={action}
            // onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Name"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4 w-full">
              Continue with Email
            </Button>
          </form>
        </Form>

        <p className="mt-5 text-sm text-center">
          Already have an account?
          <Link
            href="/auth/signin"
            className="ml-1 underline text-muted-foreground"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterComponent;
