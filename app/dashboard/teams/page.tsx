"use client"

import { TeamsList } from "@/components/teams/teams-list"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function TeamsPage() {
  const { user } = useAuth()
  const canCreateTeam = ["admin", "org_admin", "dept_manager"].includes(user?.role || "")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage your organization's teams and members.</p>
        </div>
        {canCreateTeam && (
          <CreateTeamDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          </CreateTeamDialog>
        )}
      </div>

      <TeamsList />
    </div>
  )
}
