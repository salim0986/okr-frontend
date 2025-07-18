"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Users,
  Building2,
  Briefcase,
  Edit,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function OrganizationsList() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders, user } = useAuth();
  const { toast } = useToast();

  const canEditDelete = user?.role === "admin";

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/organizations", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast({
        title: "Error",
        description: "Failed to load organizations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;

    try {
      const response = await fetch(`/api/organizations/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      toast({
        title: "Success",
        description: "Organization deleted successfully.",
      });
      fetchOrganizations(); // Refresh list
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast({
        title: "Error",
        description: "Failed to delete organization.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading organizations...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {organizations.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No organizations found. Create your first organization to get
              started.
            </p>
          </CardContent>
        </Card>
      ) : (
        organizations.map((organization) => (
          <Card key={organization.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{organization.name}</CardTitle>
                  <CardDescription>
                    Organization ID: {organization.id.substring(0, 8)}...
                  </CardDescription>
                </div>
                {canEditDelete && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit (Coming Soon)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(organization.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {organization.users?.length || 0} users
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {organization.departments?.length || 0} departments
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {organization.teams?.length || 0} teams
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
