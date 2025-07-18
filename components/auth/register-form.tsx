"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  organizationId: string;
}

interface Team {
  id: string;
  name: string;
  departmentId: string;
}

export function RegisterForm({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const { register } = useAuth();
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

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (formData.organizationId) {
      fetchDepartments();
      // Reset dependent fields when organization changes
      setFormData((prev) => ({ ...prev, departmentId: "", teamId: "" }));
      setTeams([]);
    }
  }, [formData.organizationId]);

  useEffect(() => {
    if (formData.departmentId) {
      fetchTeams();
      // Reset dependent fields when department changes
      setFormData((prev) => ({ ...prev, teamId: "" }));
    }
  }, [formData.departmentId]);

  const fetchOrganizations = async () => {
    try {
      // Use public endpoint for registration
      const response = await fetch("/api/public/organizations");
      if (response.ok) {
        const data = await response.json();
        setOrganizations(data);
      } else {
        throw new Error("Failed to fetch organizations");
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
      // Use public endpoint for registration
      const response = await fetch(
        `/api/public/departments/organization/${formData.organizationId}`
      );
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        throw new Error("Failed to fetch departments");
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
      // Use public endpoint for registration
      const response = await fetch(
        `/api/public/teams/department/${formData.departmentId}`
      );
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        throw new Error("Failed to fetch teams");
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
      await register(formData);
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          onValueChange={(value) => setFormData({ ...formData, role: value })}
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
      {["employee", "team_lead", "dept_manager"].includes(formData.role) && (
        <div className="space-y-2">
          <Label htmlFor="department">Department (Optional)</Label>
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
          <Label htmlFor="team">Team (Optional)</Label>
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
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
