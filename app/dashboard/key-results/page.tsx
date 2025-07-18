"use client"

import { KeyResultsList } from "@/components/key-results/key-results-list"
import { CreateKeyResultDialog } from "@/components/key-results/create-key-result-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function KeyResultsPage() {
  const { user } = useAuth()
  const canCreateKeyResult = ["admin", "org_admin", "dept_manager", "team_lead"].includes(user?.role || "")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Key Results</h1>
          <p className="text-muted-foreground">Track and manage key results across all objectives.</p>
        </div>
        {canCreateKeyResult && (
          <CreateKeyResultDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Key Result
            </Button>
          </CreateKeyResultDialog>
        )}
      </div>

      <KeyResultsList />
    </div>
  )
}
