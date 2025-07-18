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

export function CreateUserDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    organizationId: "",
    teamId: "",
    departmentId: "",
  });
  const { toast } = useToast();
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    if (open) {
      fetchOrganizations();
    }
  }, [open]);

  useEffect(() => {
    if (formData.organizationId) {
      fetchDepartments();
    }
  }, [formData.organizationId]);
  useEffect(() => {
    if (formData.departmentId) {
      fetchTeams();
    }
  }, [formData.departmentId]);

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
        description: "Failed to load organizations for user creation.",
        variant: "destructive",
      });
    }
  };
  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `/api/departments/organization/${formData.organizationId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast({
        title: "Error",
        description: "Failed to load departments for user creation.",
        variant: "destructive",
      });
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        `/api/teams/department/${formData.departmentId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams for user creation.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create user");

      toast({
        title: "Success",
        description: "User created successfully",
      });

      setOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        organizationId: "",
        teamId: "",
        departmentId: "",
      });
      window.location.reload(); // Simple reload to refresh list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system and assign their role.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Set password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
              value={formData.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="team_lead">Team Lead</SelectItem>
                <SelectItem value="dept_manager">Department Manager</SelectItem>
                <SelectItem value="org_admin">Organization Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.role !== "admin" && (
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, organizationId: value })
                }
                value={formData.organizationId}
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
          {["employee", "team_lead", "dept_manager"].includes(
            formData.role
          ) && (
            <div className="space-y-2">
              <Label htmlFor="team">Department(Optional)</Label>
              <Select
                disabled={!formData.organizationId}
                onValueChange={(value) =>
                  setFormData({ ...formData, departmentId: value })
                }
                value={formData.departmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {["employee", "team_lead"].includes(formData.role) && (
            <div className="space-y-2">
              <Label htmlFor="team">Team(Optional)</Label>
              <Select
                disabled={!formData.departmentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, teamId: value })
                }
                value={formData.teamId}
              >
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
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
