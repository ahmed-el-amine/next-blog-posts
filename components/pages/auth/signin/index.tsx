"use client";

import { SignInCredentialsAction } from "@/actions/auth.action";
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
import { userLoginSchema } from "@/lib/zod/userSchema.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SignInComponent = () => {
  const form = useForm<z.infer<typeof userLoginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(userLoginSchema),
  });

  const action: () => void = form.handleSubmit(async (data) => {
    const response = await SignInCredentialsAction(data);
    console.log(response);
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
          <form className="w-full space-y-4" action={action}>
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

        <div className="mt-5 space-y-5">
          <Link
            href="#"
            className="text-sm block underline text-muted-foreground text-center"
          >
            Forgot your password?
          </Link>
          <p className="text-sm text-center">
            Don&apos;t have an account?
            <Link
              href="/auth/register"
              className="ml-1 underline text-muted-foreground"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInComponent;
