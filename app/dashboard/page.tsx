import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentObjectives } from "@/components/dashboard/recent-objectives"
import { ProgressChart } from "@/components/dashboard/progress-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your OKRs and progress.</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentObjectives />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <ProgressChart />
    </div>
  )
}
