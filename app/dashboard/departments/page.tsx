"use client"

import { DepartmentsList } from "@/components/departments/departments-list"
import { CreateDepartmentDialog } from "@/components/departments/create-department-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function DepartmentsPage() {
  const { user } = useAuth()
  const canCreateDepartment = ["admin", "org_admin"].includes(user?.role || "")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Manage your organization's departments.</p>
        </div>
        {canCreateDepartment && (
          <CreateDepartmentDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Department
            </Button>
          </CreateDepartmentDialog>
        )}
      </div>

      <DepartmentsList />
    </div>
  )
}
