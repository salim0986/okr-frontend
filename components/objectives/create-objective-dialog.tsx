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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"

export function CreateObjectiveDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [formData, setFormData] = useState({
    objective: "",
    teamId: "",
    departmentId: "",
  })
  const { toast } = useToast()
  const { getAuthHeaders, user } = useAuth()

  useEffect(() => {
    if (open) {
      fetchTeams()
      fetchDepartments()
    }
  }, [open])

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams", {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setTeams(data)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
      toast({
        title: "Error",
        description: "Failed to load teams for objective creation.",
        variant: "destructive",
      })
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments", {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setDepartments(data)
      }
    } catch (error) {
      console.error("Error fetching departments:", error)
      toast({
        title: "Error",
        description: "Failed to load departments for objective creation.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/objectives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...formData,
          createdById: user?.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to create objective")

      toast({
        title: "Success",
        description: "Objective created successfully",
      })

      setOpen(false)
      setFormData({
        objective: "",
        teamId: "",
        departmentId: "",
      })
      window.location.reload() // Simple reload to refresh list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create objective",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Objective</DialogTitle>
          <DialogDescription>Add a new objective for your team to track progress towards your goals.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="objective">Objective Title</Label>
            <Input
              id="objective"
              placeholder="Enter objective title"
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, teamId: value })} value={formData.teamId}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
              value={formData.departmentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Objective"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
