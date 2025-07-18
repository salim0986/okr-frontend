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
import { MoreHorizontal, Edit, Trash2, UserIcon } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders, user } = useAuth();
  const { toast } = useToast();

  const canEditDelete = ["admin", "org_admin"].includes(user?.role || "");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No users found.</p>
          </CardContent>
        </Card>
      ) : (
        users.map((userItem) => (
          <Card key={userItem.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{userItem.name}</CardTitle>
                  <CardDescription>{userItem.email}</CardDescription>
                  <Badge variant="secondary" className="mt-2 capitalize">
                    {userItem.role.replace("_", " ")}
                  </Badge>
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
                        onClick={() => handleDelete(userItem.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>Org: {userItem.organization?.name || "N/A"}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span>Team: {userItem.team?.name || "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
