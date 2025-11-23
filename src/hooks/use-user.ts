// use-user.ts
import { AccountSettingsData } from "@/schemas/authentication";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUserQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });
}

export function useUpdateAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      currentPassword,
      email,
      password,
    }: AccountSettingsData) => {
      const supabase = createClient();
      //Getting the previous email
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      // 1.  re-authenticate
      const { error: reAuth } = await supabase.auth.signInWithPassword({
        email: currentUser?.email || email,
        password: currentPassword,
      });

      if (reAuth) throw new Error("Current password is incorrect");

      const toUpdate: { email?: string; password?: string } = {};

      // 2. e-mail changed?
      if (email !== currentUser?.email) toUpdate.email = email;

      // 3. password requested?
      if (password) toUpdate.password = password;

      // 4. nothing changed → noop
      if (Object.keys(toUpdate).length === 0) return;

      const { error } = await supabase.auth.updateUser(toUpdate);
      if (error) throw error;
    },
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Your account information was updated successfully!");
    },
  });
}
