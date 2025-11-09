"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { useSearchParams } from "next/navigation";
import { Button } from "@ui/button";
import { Checkbox } from "@ui/checkbox";
import { Loader, Lock, MailIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { ChefHat, Eye, EyeOff } from "lucide-react";
import { signup } from "@/app/auth/actions/actions";
import { useRouter } from "next/navigation";
import { InviteFormData, formSchema } from "@/schemas/invite-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@ui/input-group";

export function InviteSignupForm() {
  const whatsappMessage =
    "Hey, I have a problem with creating my account. Could I please help me?";
  const whatsappLink = `https://wa.me/254717448835?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // declaring th router so that I can redirect the user to another page when they are created
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<InviteFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: InviteFormData) => {
    setLoading(true);
    const result = await signup({
      email: values.email,
      password: values.password,
      token: token ?? "",
    });
    setLoading(false);
    if (result.success) {
      toast.success("Account created successfully!");
      router.push(`/auth/verify-pending?email=${values.email}`);
    } else {
      toast.error(result.error || "Signup failed.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-6 md:px-6 min-h-screen lg:min-h-0">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4 lg:hidden">
            <div className="bg-card-foreground/10 rounded-lg p-2">
              <ChefHat className="h-6 w-6 text-card-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">
                Restaurant Admin
              </h1>
              <p className="text-card-foreground/70 text-sm">
                Management Dashboard
              </p>
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-Foreground">
            Create your Account
          </CardTitle>
          <p className="text-muted-foreground text-sm md:text-base">
            Create your restaurant admin account
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                disabled={loading}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm text-card-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type="email"
                          {...field}
                          placeholder="Write your email here..."
                        />
                        <InputGroupAddon>
                          <MailIcon />
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                disabled={loading}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm text-card-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type={showPassword ? "text" : "password"}
                          placeholder="Write your password here..."
                          {...field}
                        />
                        <InputGroupAddon>
                          <Lock />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff className="text-muted-foreground" />
                            ) : (
                              <Eye className="text-muted-foreground" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                disabled={loading}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm text-card-foreground">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupInput
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          placeholder="Write your password confirmation here..."
                        />
                        <InputGroupAddon>
                          <Lock />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="text-muted-foreground" />
                            ) : (
                              <Eye className="text-muted-foreground" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="terms"
                disabled={loading}
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="terms"
                        className="text-sm text-gray-600 leading-snug"
                      >
                        <span className="inline">
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-primary hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="text-primary hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </span>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && <Loader className="animate-spin" />}
                {loading ? "Creating account" : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Need help getting started?{" "}
              <Link
                href={whatsappLink}
                className="text-primary hover:text-primary/80"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
