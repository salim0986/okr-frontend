"use client"

import { OrganizationsList } from "@/components/organizations/organizations-list"
import { CreateOrganizationDialog } from "@/components/organizations/create-organization-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function OrganizationsPage() {
  const { user } = useAuth()
  const canCreateOrganization = user?.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">Manage organizations within the system.</p>
        </div>
        {canCreateOrganization && (
          <CreateOrganizationDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Organization
            </Button>
          </CreateOrganizationDialog>
        )}
      </div>

      <OrganizationsList />
    </div>
  )
}
