"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Users, CheckCircle } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export function DashboardStats() {
  const [stats, setStats] = useState([
    {
      title: "Active Objectives",
      value: "0",
      change: "",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Key Results",
      value: "0",
      change: "",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Team Members",
      value: "0",
      change: "",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg Progress",
      value: "0%",
      change: "",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ])
  const { getAuthHeaders } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const objectivesResponse = await fetch("/api/objectives", { headers: getAuthHeaders() })
      const objectivesData = await objectivesResponse.json()

      const keyResultsResponse = await fetch("/api/key-results", { headers: getAuthHeaders() })
      const keyResultsData = await keyResultsResponse.json()

      const usersResponse = await fetch("/api/users", { headers: getAuthHeaders() })
      const usersData = await usersResponse.json()

      const progressResponse = await fetch("/api/progress", { headers: getAuthHeaders() })
      const progressData = await progressResponse.json()

      const totalProgress = progressData.reduce((sum: number, p: any) => sum + p.progress, 0)
      const avgProgress = progressData.length > 0 ? (totalProgress / progressData.length).toFixed(0) : 0

      setStats([
        {
          title: "Active Objectives",
          value: objectivesData.length.toString(),
          change: "",
          icon: Target,
          color: "text-blue-600",
        },
        {
          title: "Key Results",
          value: keyResultsData.length.toString(),
          change: "",
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          title: "Team Members",
          value: usersData.length.toString(),
          change: "",
          icon: Users,
          color: "text-purple-600",
        },
        {
          title: "Avg Progress",
          value: `${avgProgress}%`,
          change: "",
          icon: TrendingUp,
          color: "text-orange-600",
        },
      ])
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
