import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase-server";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  // Only fetch categories server-side (they don't change often)
  const categories = await prisma.category.findMany({
    where:   { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  const dbName = user.user_metadata?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Dashboard" subtitle={`Welcome back, ${dbName} 👋`} />
      <DashboardClient
        initialCategories={categories}
        userName={dbName}
      />
    </div>
  );
}
