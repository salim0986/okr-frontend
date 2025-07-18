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
import { MoreHorizontal, Users, Briefcase, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function DepartmentsList() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders, user } = useAuth();
  const { toast } = useToast();

  const canEditDelete = ["admin", "org_admin"].includes(user?.role || "");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: "Failed to load departments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      toast({
        title: "Success",
        description: "Department deleted successfully.",
      });
      fetchDepartments(); // Refresh list
      window.location.reload(); // Reload page to reflect changes
    } catch (error) {
      console.error("Error deleting department:", error);
      toast({
        title: "Error",
        description: "Failed to delete department.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading departments...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {departments.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No departments found. Create your first department to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        departments.map((department) => (
          <Card key={department.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <CardDescription>
                    {department.organization?.name || "No organization"}
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
                        onClick={() => handleDelete(department.id)}
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
                    {department.teams?.length || 0} teams
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {department.okrs?.length || 0} objectives
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
