"use server";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { SignupProps } from "@/types/authentication";
import { LoginFormData } from "@/schemas/login";

export async function login(loginData: LoginFormData) {
  const supabase = await createClient();
  // type-casting here for convenience
  const data = {
    email: loginData.email as string,
    password: loginData.password as string,
  };

  const { error: loginError } = await supabase.auth.signInWithPassword(data);

  if (loginError) {
    return {
      success: false,
      message: "Your username or password might be wrong",
    };
  }
  //Before redirect check if the user has only one branch and set it on the user_metadata
  const { data: branches, error } = await supabase
    .from("branch_settings")
    .select("*");
  if (error) {
    return {
      success: false,
      message: "There was an error fetching your restaurant data",
    };
  }

  // If only one branch exists, set its ID in user_metadata
  if (branches.length === 1) {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { branch_id: branches[0].id },
    });
    if (updateError)
      return {
        success: false,
        message: "There was an error onboarding you to the dashboard",
      };

    redirect("/dashboard");
  }

  redirect("/branches");
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
  // Clear branch_id metadata first
  const { error: updateError } = await supabase.auth.updateUser({
    data: { branch_id: null },
  });

  if (updateError) console.error("Failed to clear branch_id:", updateError);
  redirect("/login");
}
