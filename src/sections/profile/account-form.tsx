"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@ui/input-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Eye, EyeOff, KeyRound, Mail, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  accountSettingsSchema,
  type AccountSettingsData,
} from "@/schemas/authentication";
import { useUserQuery } from "@/hooks/use-user";
import { useUpdateAccountMutation } from "@/hooks/use-user";

export function AccountForm() {
  const { data: user, isPending } = useUserQuery();
  const [isLoading, setIsLoading] = useState(false);
  const update = useUpdateAccountMutation();
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const form = useForm<AccountSettingsData>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      email: "",
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user?.email)
      form.reset({
        email: user.email,
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
  }, [user]);

  const onSubmit = (values: AccountSettingsData) => {
    setIsLoading(true);
    update.mutate(values, { onSettled: () => setIsLoading(false) });
  };

  const InputSkeleton = <Skeleton className="h-9 w-full" />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-6">
        <div className="w-full flex gap-3 flex-col md:flex-row items-start">
          {/* ----------------- Email ----------------- */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  {isPending ? (
                    InputSkeleton
                  ) : (
                    <InputGroup>
                      <InputGroupInput
                        placeholder="you@example.com"
                        {...field}
                      />
                      <InputGroupAddon>
                        <Mail className="h-4 w-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ----------------- Current Password ----------------- */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Current password</FormLabel>
                <FormControl>
                  {isPending ? (
                    InputSkeleton
                  ) : (
                    <InputGroup>
                      <InputGroupInput
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...field}
                      />
                      <InputGroupAddon>
                        <KeyRound className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton
                          onClick={() =>
                            setShowCurrentPassword((prev) => !prev)
                          }
                        >
                          {showCurrentPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex gap-3 flex-col md:flex-row items-start">
          {/* ----------------- New Password ----------------- */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>
                  New password (leave blank to keep current)
                </FormLabel>
                <FormControl>
                  {isPending ? (
                    InputSkeleton
                  ) : (
                    <InputGroup>
                      <InputGroupInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Min 8 chars, 1 upper, 1 number"
                        {...field}
                      />
                      <InputGroupAddon>
                        <KeyRound className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ----------------- Confirm Password ----------------- */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  {isPending ? (
                    InputSkeleton
                  ) : (
                    <InputGroup>
                      <InputGroupInput
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...field}
                      />
                      <InputGroupAddon>
                        <KeyRound className="h-4 w-4" />
                      </InputGroupAddon>
                      <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={!form.formState.isDirty || isLoading || isPending}
        >
          {isLoading ? (
            <>
              <Spinner />
              Saving account info…
            </>
          ) : (
            <>
              <Save />
              Save account info
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
