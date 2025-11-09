"use server";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignupProps } from "@/types/authentication";

export async function login(formData: FormData) {
  const supabase = await createClient();
  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      success: false,
      message: "Your username or password might be wrong",
    };
  }

  redirect("/dashboard");
}

export async function signup({ email, password, token }: SignupProps) {
  const supabase = await createClient();

  // Validate token (exists, not used, not expired)
  const { data: invite, error: inviteError } = await supabase
    .from("invite_tokens")
    .select("*")
    .eq("token", token)
    .eq("used", false)
    .maybeSingle();

  if (inviteError || !invite) {
    return { success: false, error: "Invalid or expired invite token." };
  }

  // Create user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { success: false, error: signUpError.message };
  }

  const userId = authData.user?.id;
  if (!userId) {
    return { success: false, error: "User ID not returned after signup." };
  }

  //  Delete the invite token now that it's used
  const { error: deleteError } = await supabase
    .from("invite_tokens")
    .delete()
    .eq("token", token);

  if (deleteError) {
    return { success: false, error: "Failed to delete invite token." };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
