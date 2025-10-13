import { StatsOverview } from "@/sections/dashboard/stats-overview";
import { RecentActivity } from "@/sections/dashboard/recent-activity";
import { QuickActions } from "@/sections/dashboard/quick-actions";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your restaurant admin dashboard
        </p>
      </div>
      <StatsOverview />
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}
