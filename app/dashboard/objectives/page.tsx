"use client"

import { ObjectivesList } from "@/components/objectives/objectives-list"
import { CreateObjectiveDialog } from "@/components/objectives/create-objective-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function ObjectivesPage() {
  const { user } = useAuth()
  const canCreateObjective = ["admin", "org_admin", "dept_manager", "team_lead"].includes(user?.role || "")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Objectives</h1>
          <p className="text-muted-foreground">Manage your team's objectives and key results.</p>
        </div>
        {canCreateObjective && (
          <CreateObjectiveDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Objective
            </Button>
          </CreateObjectiveDialog>
        )}
      </div>

      <ObjectivesList />
    </div>
  )
}
