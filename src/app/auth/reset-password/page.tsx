"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@ui/card";
import { Button } from "@ui/button";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@ui/form";
import { toast } from "sonner";
import { EyeOff, Eye } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  resetPasswordSchema,
  ResetPassworFormData,
} from "@/schemas/authentication";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //   declaring supabase for manipulating database
  const supabase = createClient();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (value: ResetPassworFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: value.password,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Your password was successfully changed.");
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/dashboard");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(() => false);
    }
  };

  const PasswordIcon = showPassword ? EyeOff : Eye;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type={showPassword ? "text" : "password"}
                          placeholder="New password"
                          {...field}
                          className="pr-10"
                        />
                        <InputGroupAddon align={"inline-end"}>
                          <InputGroupButton
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            <PasswordIcon className="size-5" />
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("password").length > 0 && (
                <PasswordStrengthMeter password={form.watch("password")} />
              )}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
