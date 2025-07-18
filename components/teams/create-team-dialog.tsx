"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";

interface Department {
  id: string;
  name: string;
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
}

export function CreateTeamDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
    organizationId: "",
  });
  const { toast } = useToast();
  const { getAuthHeaders, user } = useAuth();

  const initializeForm = () => {
    const initialData = { name: "", departmentId: "", organizationId: "" };

    // Auto-fill based on user role
    if (user?.role === "org_admin" && user?.organizationId) {
      initialData.organizationId = user?.organizationId;
    } else if (
      user?.role === "dept_manager" &&
      user?.departmentId &&
      user?.organizationId
    ) {
      initialData.departmentId = user?.departmentId;
      initialData.organizationId = user?.organizationId;
    }

    setFormData(initialData);
  };

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
        description: "Failed to load departments for team creation.",
        variant: "destructive",
      });
    }
  };

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
        description: "Failed to load organizations for team creation.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create team");
      }

      toast({
        title: "Success",
        description: "Team created successfully",
      });

      setOpen(false);
      setFormData({ name: "", departmentId: "", organizationId: "" });
      window.location.reload(); // Simple reload to refresh list
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDialogDescription = () => {
    switch (user?.role) {
      case "admin":
        return "Add a new team to any organization and department.";
      case "org_admin":
        return `Add a new team to your organization: ${
          user?.organizationName || "your organization"
        }.`;
      case "dept_manager":
        return `Add a new team to your department: ${
          user?.departmentName || "your department"
        }.`;
      default:
        return "Add a new team.";
    }
  };

  const getCurrentOrganization = () => {
    if (user?.role === "org_admin" || user?.role === "dept_manager") {
      return (
        organizations.find((org) => org.id === user?.organizationId) || {
          id: user?.organizationId || "",
          name: user?.organizationName || "Your Organization",
        }
      );
    }
    return null;
  };

  const getCurrentDepartment = () => {
    if (user?.role === "dept_manager") {
      return (
        departments.find((dept) => dept.id === user?.departmentId) || {
          id: user?.departmentId || "",
          name: user?.departmentName || "Your Department",
        }
      );
    }
    return null;
  };

  useEffect(() => {
    if (open) {
      initializeForm();
    }
    if (user?.role === "admin") {
      fetchOrganizations();
    }
    if (user?.role === "admin" || user?.role === "org_admin") {
      fetchDepartments();
    }
  }, [open, user]);

  // Don't render if user doesn't have permission to create teams
  if (!user || !["admin", "org_admin", "dept_manager"].includes(user?.role)) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              placeholder="Enter team name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Organization Selection - Only for Admin */}
          {user?.role === "admin" && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    organizationId: value,
                    departmentId: "",
                  })
                }
                value={formData.organizationId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Organization Display - For Org Admin and Dept Manager */}
          {(user?.role === "org_admin" || user?.role === "dept_manager") && (
            <div className="space-y-2">
              <Label>Organization</Label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                {getCurrentOrganization()?.name || "Loading..."}
              </div>
            </div>
          )}

          {/* Department Selection - Only for Admin and Org Admin */}
          {(user?.role === "admin" || user?.role === "org_admin") && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, departmentId: value })
                }
                value={formData.departmentId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments
                    .filter(
                      (dept) =>
                        user?.role === "admin" ||
                        dept.organizationId === user?.organizationId
                    )
                    .map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Department Display - For Dept Manager */}
          {user?.role === "dept_manager" && (
            <div className="space-y-2">
              <Label>Department</Label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                {getCurrentDepartment()?.name || "Loading..."}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
