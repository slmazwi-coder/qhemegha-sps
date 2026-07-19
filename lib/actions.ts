"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import type { Page, NewsItem, StaffMember, Application } from "@/lib/data";

async function currentStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data } = await supabase
    .from("staff_users")
    .select("role")
    .eq("id", user.id)
    .single();
  return { user, staff: data as { role: "admin" | "editor" } | null };
}

export async function updatePage(page: Page) {
  const { staff } = await currentStaff();
  if (!staff) throw new Error("Not authorised");
  const supabase = await createClient();
  const { error } = await supabase.from("pages").upsert({
    slug: page.slug,
    title: page.title,
    body: page.body,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/${page.slug}`);
}

export async function createNewsItem(item: NewsItem) {
  const { staff } = await currentStaff();
  if (!staff) throw new Error("Not authorised");
  const supabase = await createClient();
  const { error } = await supabase.from("news_items").insert({
    title: item.title,
    body: item.body,
    image_url: item.image_url,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/news");
  revalidatePath("/");
}

export async function updateNewsItem(id: string, item: NewsItem) {
  const { staff } = await currentStaff();
  if (!staff) throw new Error("Not authorised");
  const supabase = await createClient();
  const { error } = await supabase
    .from("news_items")
    .update({
      title: item.title,
      body: item.body,
      image_url: item.image_url,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/news");
  revalidatePath("/");
}

export async function deleteNewsItem(id: string) {
  const { staff } = await currentStaff();
  if (!staff) throw new Error("Not authorised");
  const supabase = await createClient();
  const { error } = await supabase.from("news_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/news");
  revalidatePath("/");
}

export async function createStaffMember(member: StaffMember) {
  const { staff } = await currentStaff();
  if (!staff) throw new Error("Not authorised");
  const supabase = await createClient();
  const { error } = await supabase.from("staff_directory").insert({
    full_name: member.full_name,
    role_title: member.role_title,
    photo_url: member.photo_url,
    display_order: member.display_order,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/staff-page");
  revalidatePath("/");
}

export async function updateStaffMember(id: string, member: StaffMember) {
  const { staff } = await currentStaff();
  if (!staff) throw new Error("Not authorised");
  const supabase = await createClient();
  const { error } = await supabase
    .from("staff_directory")
    .update({
      full_name: member.full_name,
      role_title: member.role_title,
      photo_url: member.photo_url,
      display_order: member.display_order,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/staff-page");
  revalidatePath("/");
}

export async function deleteStaffMember(id: string) {
  const { staff } = await currentStaff();
  if (!staff) throw new Error("Not authorised");
  const supabase = await createClient();
  const { error } = await supabase.from("staff_directory").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/staff-page");
  revalidatePath("/");
}

export async function updateApplication(
  id: string,
  updates: Partial<Application>,
) {
  const { staff } = await currentStaff();
  if (!staff) throw new Error("Not authorised");
  const supabase = await createClient();
  const { error } = await supabase
    .from("applications")
    .update({
      status: updates.status,
      internal_notes: updates.internal_notes,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/staff/applications");
}

export async function createStaffUser(input: {
  email: string;
  password: string;
  full_name: string;
  role: "admin" | "editor";
}) {
  const { staff } = await currentStaff();
  if (!staff || staff.role !== "admin") throw new Error("Admin only");

  const admin = adminClient();
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  });
  if (authError || !authData.user)
    throw new Error(authError?.message ?? "Could not create user");

  const { error } = await admin.from("staff_users").insert({
    id: authData.user.id,
    full_name: input.full_name,
    role: input.role,
  });
  if (error) {
    // Roll back auth user creation
    await admin.auth.admin.deleteUser(authData.user.id);
    throw new Error(error.message);
  }

  revalidatePath("/staff/users");
}

export async function deleteStaffUser(id: string) {
  const { staff } = await currentStaff();
  if (!staff || staff.role !== "admin") throw new Error("Admin only");

  const admin = adminClient();
  const { error } = await admin.from("staff_users").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await admin.auth.admin.deleteUser(id);
  revalidatePath("/staff/users");
}
