"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { CreateKeyResultDialog } from "@/components/key-results/create-key-result-dialog"
import { UpdateProgressDialog } from "@/components/progress/update-progress-dialog"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface ObjectiveDetailProps {
  objectiveId: string
}

export function ObjectiveDetail({ objectiveId }: ObjectiveDetailProps) {
  const [objective, setObjective] = useState<any>(null)
  const [keyResults, setKeyResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { getAuthHeaders, user } = useAuth()
  const { toast } = useToast()

  const canManageObjective = ["admin", "org_admin", "dept_manager"].includes(user?.role || "")
  const canManageKeyResult = ["admin", "org_admin", "dept_manager", "team_lead"].includes(user?.role || "")
  const canUpdateProgress = ["admin", "org_admin", "dept_manager", "team_lead", "employee"].includes(user?.role || "")

  useEffect(() => {
    fetchObjectiveDetails()
  }, [objectiveId])

  const fetchObjectiveDetails = async () => {
    try {
      const objectiveResponse = await fetch(`/api/objectives/${objectiveId}`, {
        headers: getAuthHeaders(),
      })
      if (objectiveResponse.ok) {
        const objectiveData = await objectiveResponse.json()
        setObjective(objectiveData)
      } else {
        throw new Error("Failed to fetch objective")
      }

      const keyResultsResponse = await fetch(`/api/key-results/objective/${objectiveId}`, {
        headers: getAuthHeaders(),
      })
      if (keyResultsResponse.ok) {
        const keyResultsData = await keyResultsResponse.json()
        setKeyResults(keyResultsData)
      } else {
        throw new Error("Failed to fetch key results")
      }
    } catch (error) {
      console.error("Error fetching objective details:", error)
      toast({
        title: "Error",
        description: "Failed to load objective details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKeyResult = async (krId: string) => {
    if (!confirm("Are you sure you want to delete this key result?")) return

    try {
      const response = await fetch(`/api/key-results/${krId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (!response.ok) throw new Error("Failed to delete key result")

      toast({
        title: "Success",
        description: "Key result deleted successfully.",
      })
      fetchObjectiveDetails() // Refresh list
    } catch (error) {
      console.error("Error deleting key result:", error)
      toast({
        title: "Error",
        description: "Failed to delete key result.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!objective) {
    return <div>Objective not found</div>
  }

  const getStatusColor = (progressValue: number) => {
    if (progressValue >= 90) return "bg-blue-100 text-blue-800" // Ahead
    if (progressValue >= 70) return "bg-green-100 text-green-800" // On-track
    if (progressValue >= 40) return "bg-yellow-100 text-yellow-800" // At-risk
    return "bg-red-100 text-red-800" // Behind
  }

  const totalKeyResults = keyResults.length || 0
  const completedKeyResults = keyResults.filter((kr: any) => kr.currentValue >= kr.targetValue).length || 0
  const overallObjectiveProgress = totalKeyResults > 0 ? Math.round((completedKeyResults / totalKeyResults) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{objective.objective}</h1>
          <p className="text-muted-foreground mt-2">
            {objective.team?.name || "No Team"} • {objective.department?.name || "No Department"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(overallObjectiveProgress)}>
            {overallObjectiveProgress >= 90
              ? "Ahead"
              : overallObjectiveProgress >= 70
                ? "On Track"
                : overallObjectiveProgress >= 40
                  ? "At Risk"
                  : "Behind"}
          </Badge>
          {canManageObjective && (
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit (Coming Soon)
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Key Results</CardTitle>
            {canManageKeyResult && (
              <CreateKeyResultDialog objectiveId={objectiveId} onSuccess={fetchObjectiveDetails}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Key Result
                </Button>
              </CreateKeyResultDialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {keyResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No key results yet. Add one to start tracking progress.
            </p>
          ) : (
            keyResults.map((keyResult) => (
              <Card key={keyResult.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{keyResult.title}</h4>
                      {keyResult.description && (
                        <p className="text-sm text-muted-foreground mt-1">{keyResult.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {canUpdateProgress && (
                        <UpdateProgressDialog keyResult={keyResult} onSuccess={fetchObjectiveDetails}>
                          <Button variant="outline" size="sm">
                            Update Progress
                          </Button>
                        </UpdateProgressDialog>
                      )}
                      {canManageKeyResult && (
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteKeyResult(keyResult.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>
                        {keyResult.currentValue || 0} / {keyResult.targetValue || 100}
                      </span>
                    </div>
                    <Progress
                      value={((keyResult.currentValue || 0) / (keyResult.targetValue || 100)) * 100}
                      className="h-2"
                    />
                    <p className="text-sm text-muted-foreground text-right">
                      {Math.round(((keyResult.currentValue || 0) / (keyResult.targetValue || 100)) * 100)}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
