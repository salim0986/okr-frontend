"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/providers/auth-provider"
import { useToast } from "@/hooks/use-toast"

export function ProgressList() {
  const [progressUpdates, setProgressUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { getAuthHeaders } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchProgressUpdates()
  }, [])

  const fetchProgressUpdates = async () => {
    try {
      const response = await fetch("/api/progress", {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setProgressUpdates(data)
      }
    } catch (error) {
      console.error("Error fetching progress updates:", error)
      toast({
        title: "Error",
        description: "Failed to load progress updates.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading progress updates...</div>
  }

  return (
    <div className="space-y-4">
      {progressUpdates.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No progress updates found. Start updating progress on key results.
            </p>
          </CardContent>
        </Card>
      ) : (
        progressUpdates.map((update) => (
          <Card key={update.id}>
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{update.user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{update.user?.name || "Unknown User"}</p>
                      <p className="text-sm text-muted-foreground">
                        Updated progress on "{update.keyResult?.title || "Unknown Key Result"}"
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{update.progress}%</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {update.note && <p className="text-sm bg-gray-50 p-3 rounded-md">{update.note}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
