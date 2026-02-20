import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email || "",
        fullName:
          profile?.full_name || user.user_metadata?.full_name || "User",
        faceScanUrl: profile?.face_scan_url || null,
        faceScanUploadedAt: profile?.face_scan_uploaded_at || null,
        onboardingComplete: profile?.onboarding_complete || false,
        createdAt: user.created_at,
      }}
    />
  );
}
