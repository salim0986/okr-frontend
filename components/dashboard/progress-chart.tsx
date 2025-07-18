"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Team progress over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart component would go here (e.g., Recharts, Nivo, or custom SVG/Canvas)
        </div>
      </CardContent>
    </Card>
  )
}
