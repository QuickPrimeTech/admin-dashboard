"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

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
    console.log(error);
    return {
      success: false,
      message: "Your username or password might be wrong",
    };
  }

  redirect("/admin");
}

export async function signup({
  email,
  password,
  restaurantName,
}: {
  email: string;
  password: string;
  restaurantName: string;
}) {
  const supabase = await createClient();

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

  const { error: insertError } = await supabase
    .from("restaurants")
    .insert([{ user_id: userId, name: restaurantName }]);

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath("/", "layout");

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
