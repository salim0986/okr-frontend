"use client"

import { ProgressList } from "@/components/progress/progress-list"
import { UpdateProgressDialog } from "@/components/progress/update-progress-dialog"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function ProgressPage() {
  const { user } = useAuth()
  const canUpdateProgress = ["admin", "org_admin", "dept_manager", "team_lead", "employee"].includes(user?.role || "")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
          <p className="text-muted-foreground">Track and update progress on key results.</p>
        </div>
        {canUpdateProgress && (
          <UpdateProgressDialog>
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Update Progress
            </Button>
          </UpdateProgressDialog>
        )}
      </div>

      <ProgressList />
    </div>
  )
}
