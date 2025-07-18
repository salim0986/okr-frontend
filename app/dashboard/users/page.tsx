"use client"

import { UsersList } from "@/components/users/users-list"
import { CreateUserDialog } from "@/components/users/create-user-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function UsersPage() {
  const { user } = useAuth()
  const canCreateUser = ["admin", "org_admin"].includes(user?.role || "")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and roles.</p>
        </div>
        {canCreateUser && (
          <CreateUserDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New User
            </Button>
          </CreateUserDialog>
        )}
      </div>

      <UsersList />
    </div>
  )
}
