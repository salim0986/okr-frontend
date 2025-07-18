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
import { MoreHorizontal, Users, Target, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function TeamsList() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders, user } = useAuth();
  const { toast } = useToast();

  const canEditDelete = ["admin", "org_admin", "dept_manager"].includes(
    user?.role || ""
  );

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/teams", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    try {
      const response = await fetch(`/api/teams/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      toast({
        title: "Success",
        description: "Team deleted successfully.",
      });
      fetchTeams(); // Refresh list
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({
        title: "Error",
        description: "Failed to delete team.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading teams...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {teams.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No teams found. Create your first team to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <CardDescription>
                    {team.department?.name || "No department"}
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
                        onClick={() => handleDelete(team.id)}
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
                    {team.users?.length || 0} members
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {team.okrs?.length || 0} objectives
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
