"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"

interface UpdateProgressDialogProps {
  children: React.ReactNode
  keyResult?: any // Optional, if updating from a specific KR detail page
  onSuccess?: () => void
}

export function UpdateProgressDialog({ children, keyResult, onSuccess }: UpdateProgressDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState([
    keyResult ? Math.round(((keyResult.currentValue || 0) / (keyResult.targetValue || 100)) * 100) : 0,
  ])
  const [note, setNote] = useState("")
  const [selectedKeyResultId, setSelectedKeyResultId] = useState(keyResult?.id || "")
  const [allKeyResults, setAllKeyResults] = useState<any[]>([])

  const { toast } = useToast()
  const { user, getAuthHeaders } = useAuth()

  useEffect(() => {
    if (open && !keyResult) {
      fetchAllKeyResults()
    }
    if (keyResult) {
      setProgress([Math.round(((keyResult.currentValue || 0) / (keyResult.targetValue || 100)) * 100)])
      setSelectedKeyResultId(keyResult.id)
    }
  }, [open, keyResult])

  const fetchAllKeyResults = async () => {
    try {
      const response = await fetch("/api/key-results", {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setAllKeyResults(data)
      }
    } catch (error) {
      console.error("Error fetching all key results:", error)
      toast({
        title: "Error",
        description: "Failed to load key results for progress update.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!selectedKeyResultId) {
      toast({
        title: "Error",
        description: "Please select a key result.",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      const currentKR = keyResult || allKeyResults.find((kr) => kr.id === selectedKeyResultId)
      if (!currentKR) {
        throw new Error("Key Result not found for update.")
      }

      // Create progress update record
      const progressResponse = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          keyResultId: selectedKeyResultId,
          userId: user?.id,
          progress: progress[0],
          note,
        }),
      })

      if (!progressResponse.ok) throw new Error("Failed to create progress update")

      // Update key result's current value
      const newCurrentValue = Math.round((progress[0] / 100) * (currentKR.targetValue || 100))
      const updateKRResponse = await fetch(`/api/key-results/${selectedKeyResultId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          currentValue: newCurrentValue,
        }),
      })

      if (!updateKRResponse.ok) throw new Error("Failed to update key result current value")

      toast({
        title: "Success",
        description: "Progress updated successfully",
      })

      setOpen(false)
      setNote("")
      setSelectedKeyResultId(keyResult?.id || "")
      setProgress([keyResult ? Math.round(((keyResult.currentValue || 0) / (keyResult.targetValue || 100)) * 100) : 0])
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update progress: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const currentKRForDisplay = keyResult || allKeyResults.find((kr) => kr.id === selectedKeyResultId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            {keyResult ? `Update progress for "${keyResult.title}"` : "Update progress on a key result"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!keyResult && (
            <div className="space-y-2">
              <Label htmlFor="keyResult">Key Result</Label>
              <Select onValueChange={setSelectedKeyResultId} value={selectedKeyResultId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a key result" />
                </SelectTrigger>
                <SelectContent>
                  {allKeyResults.map((kr) => (
                    <SelectItem key={kr.id} value={kr.id}>
                      {kr.title} (Objective: {kr.objective?.objective || "N/A"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentKRForDisplay && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Progress: {progress[0]}%</Label>
                <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="w-full" />
              </div>
              <div className="text-sm text-muted-foreground">
                Current: {Math.round((progress[0] / 100) * (currentKRForDisplay.targetValue || 100))} /{" "}
                {currentKRForDisplay.targetValue || 100}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this progress update..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Progress"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
