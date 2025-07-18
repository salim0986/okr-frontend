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

export function CreateDepartmentDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    organizationId: "",
  });
  const { toast } = useToast();
  const { getAuthHeaders, user } = useAuth();

  useEffect(() => {
    if (open) {
      // For org_admin, automatically set their organization
      if (user?.role === "org_admin" && user?.organizationId) {
        setFormData({ ...formData, organizationId: user.organizationId });
      }

      // Only fetch organizations for admin users
      if (user?.role === "admin") {
        fetchOrganizations();
      }
    }
  }, [open, user]);

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
        description: "Failed to load organizations for department creation.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create department");
      }

      toast({
        title: "Success",
        description: "Department created successfully",
      });

      setOpen(false);
      setFormData({ name: "", organizationId: "" });
      window.location.reload(); // Simple reload to refresh list
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create department",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user has permission to create departments
  const canCreateDepartment =
    user?.role === "admin" || user?.role === "org_admin";

  if (!canCreateDepartment) {
    return null; // Don't render the dialog if user doesn't have permission
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Department</DialogTitle>
          <DialogDescription>
            {user?.role === "admin"
              ? "Add a new department to an organization."
              : "Add a new department to your organization."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              placeholder="Enter department name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          {/* Only show organization selector for admin users */}
          {user?.role === "admin" && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, organizationId: value })
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

          {/* Show organization info for org_admin (read-only) */}
          {user?.role === "org_admin" && user?.organizationName && (
            <div className="space-y-2">
              <Label>Organization</Label>
              <div className="px-3 py-2 bg-muted rounded-md text-sm">
                {user.organizationName}
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
            <Button
              type="submit"
              disabled={
                loading || (user?.role === "admin" && !formData.organizationId)
              }
            >
              {loading ? "Creating..." : "Create Department"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
