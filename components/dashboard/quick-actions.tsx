"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Users, TrendingUp, Plus } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { CreateObjectiveDialog } from "@/components/objectives/create-objective-dialog"
import { CreateTeamDialog } from "@/components/teams/create-team-dialog"
import { UpdateProgressDialog } from "@/components/progress/update-progress-dialog"
import { CreateUserDialog } from "@/components/users/create-user-dialog"
import { CreateDepartmentDialog } from "@/components/departments/create-department-dialog"
import { CreateOrganizationDialog } from "@/components/organizations/create-organization-dialog"

export function QuickActions() {
  const { user } = useAuth()

  const actions = [
    {
      title: "New Objective",
      description: "Create a new objective",
      icon: Target,
      component: CreateObjectiveDialog,
      roles: ["admin", "org_admin", "dept_manager", "team_lead"],
    },
    {
      title: "Update Progress",
      description: "Log progress on key results",
      icon: TrendingUp,
      component: UpdateProgressDialog,
      roles: ["admin", "org_admin", "dept_manager", "team_lead", "employee"],
    },
    {
      title: "Add Team Member",
      description: "Invite a new team member",
      icon: Users,
      component: CreateUserDialog, // Assuming this is for adding users
      roles: ["admin", "org_admin"],
    },
    {
      title: "New Team",
      description: "Create a new team",
      icon: Users,
      component: CreateTeamDialog,
      roles: ["admin", "org_admin", "dept_manager"],
    },
    {
      title: "New Department",
      description: "Create a new department",
      icon: Plus,
      component: CreateDepartmentDialog,
      roles: ["admin", "org_admin"],
    },
    {
      title: "New Organization",
      description: "Create a new organization",
      icon: Plus,
      component: CreateOrganizationDialog,
      roles: ["admin"],
    },
  ]

  const filteredActions = actions.filter((action) => action.roles.includes(user?.role || ""))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {filteredActions.length === 0 ? (
          <p className="text-center text-muted-foreground">No quick actions available for your role.</p>
        ) : (
          filteredActions.map((action) => {
            const Icon = action.icon
            const ActionComponent = action.component
            return (
              <ActionComponent key={action.title}>
                <Button variant="ghost" className="w-full justify-start h-auto p-3">
                  <Icon className="mr-3 h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              </ActionComponent>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
