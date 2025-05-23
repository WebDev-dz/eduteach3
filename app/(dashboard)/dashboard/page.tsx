import { ChartAreaInteractive } from "@/components/custom/chart-area-interactive";
import { DataTable } from "@/components/custom/data-table";
import { SectionCards } from "@/components/shared/section-cards";
import { SiteHeader } from "@/components/shared/site-header";
import { SubscriptionStatus } from "@/components/custom/subscription-status";
import { getCurrentUser } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

import data from "./data.json";
import { getUserSubscription } from "@/lib/db/dal/subscription";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Get user's subscription
  const subscription = await getUserSubscription(user.id);

  // If no subscription or trial has ended, redirect to upgrade page
  if (
    !subscription ||
    (subscription.status !== "active" && subscription.status !== "trialing")
  ) {
    redirect("/upgrade?reason=Your subscription has expired or is inactive");
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <SubscriptionStatus />
            </div>
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
