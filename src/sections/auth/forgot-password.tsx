"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Adjust import path to your client
import { Button } from "@ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@ui/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@ui/input-group";
import { Mail } from "lucide-react";
import Link from "next/link";
import {
  ForgotPassworFormData,
  forgotPasswordSchema,
} from "@/schemas/authentication";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleReset = async (data: ForgotPassworFormData) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your inbox for a password reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleReset)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type="email"
                          placeholder="Enter your email here..."
                          {...field}
                        />
                        <InputGroupAddon>
                          <Mail />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button variant={"secondary"} asChild>
                  <Link href={"/login"}>Login</Link>
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
