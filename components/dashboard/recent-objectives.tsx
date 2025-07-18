"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/providers/auth-provider"
import Link from "next/link"

export function RecentObjectives() {
  const [objectives, setObjectives] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { getAuthHeaders } = useAuth()

  useEffect(() => {
    fetchObjectives()
  }, [])

  const fetchObjectives = async () => {
    try {
      const response = await fetch("/api/objectives", {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setObjectives(data.slice(0, 3)) // Show only recent 3
      }
    } catch (error) {
      console.error("Error fetching recent objectives:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (progressValue: number) => {
    if (progressValue >= 90) return "bg-blue-100 text-blue-800" // Ahead
    if (progressValue >= 70) return "bg-green-100 text-green-800" // On-track
    if (progressValue >= 40) return "bg-yellow-100 text-yellow-800" // At-risk
    return "bg-red-100 text-red-800" // Behind
  }

  const getStatusText = (progressValue: number) => {
    if (progressValue >= 90) return "Ahead"
    if (progressValue >= 70) return "On Track"
    if (progressValue >= 40) return "At Risk"
    return "Behind"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Objectives</CardTitle>
          <CardDescription>Your team's latest objectives and their progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">Loading objectives...</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Objectives</CardTitle>
        <CardDescription>Your team's latest objectives and their progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.length === 0 ? (
          <p className="text-center text-muted-foreground">No recent objectives found.</p>
        ) : (
          objectives.map((objective) => {
            const totalKeyResults = objective.keyResults?.length || 0
            const completedKeyResults =
              objective.keyResults?.filter((kr: any) => kr.currentValue >= kr.targetValue).length || 0
            const overallProgress = totalKeyResults > 0 ? Math.round((completedKeyResults / totalKeyResults) * 100) : 0

            return (
              <div key={objective.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Link href={`/dashboard/objectives/${objective.id}`}>
                      <h4 className="font-medium hover:text-primary cursor-pointer">{objective.objective}</h4>
                    </Link>
                    <p className="text-sm text-muted-foreground">{objective.team?.name || "No Team"}</p>
                  </div>
                  <Badge className={getStatusColor(overallProgress)}>{getStatusText(overallProgress)}</Badge>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-right">{overallProgress}% complete</p>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
