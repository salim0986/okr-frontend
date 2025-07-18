"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, TrendingUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateProgressDialog } from "@/components/progress/update-progress-dialog";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";

export function KeyResultsList() {
  const [keyResults, setKeyResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders, user } = useAuth();
  const { toast } = useToast();

  const canManageKeyResult = [
    "admin",
    "org_admin",
    "dept_manager",
    "team_lead",
  ].includes(user?.role || "");
  const canUpdateProgress = [
    "admin",
    "org_admin",
    "dept_manager",
    "team_lead",
    "employee",
  ].includes(user?.role || "");

  useEffect(() => {
    fetchKeyResults();
  }, []);

  const fetchKeyResults = async () => {
    try {
      const response = await fetch("/api/key-results", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();

        setKeyResults(data);
      }
    } catch (error) {
      console.error("Error fetching key results:", error);
      toast({
        title: "Error",
        description: "Failed to load key results.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this key result?")) return;

    try {
      const response = await fetch(`/api/key-results/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      toast({
        title: "Success",
        description: "Key result deleted successfully.",
      });
      fetchKeyResults(); // Refresh list
    } catch (error) {
      console.error("Error deleting key result:", error);
      toast({
        title: "Error",
        description: "Failed to delete key result.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading key results...</div>;
  }

  return (
    <div className="space-y-4">
      {keyResults.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No key results found. Create objectives first, then add key
              results.
            </p>
          </CardContent>
        </Card>
      ) : (
        keyResults.map((keyResult) => (
          <Card key={keyResult.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{keyResult.title}</CardTitle>
                  <CardDescription>{keyResult.description}</CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>
                      Objective: {keyResult.objective?.objective || "N/A"}
                    </span>
                    <span>•</span>
                    <span>Target: {keyResult.targetValue || 100}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {canUpdateProgress && (
                    <UpdateProgressDialog
                      keyResult={keyResult}
                      onSuccess={fetchKeyResults}
                    >
                      <Button variant="outline" size="sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Update
                      </Button>
                    </UpdateProgressDialog>
                  )}
                  {canManageKeyResult && (
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
                          onClick={() => handleDelete(keyResult.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {keyResult.currentValue || 0} /{" "}
                    {keyResult.targetValue || 100}
                  </span>
                </div>
                <Progress
                  value={
                    ((keyResult.currentValue || 0) /
                      (keyResult.targetValue || 100)) *
                    100
                  }
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground text-right">
                  {Math.round(
                    ((keyResult.currentValue || 0) /
                      (keyResult.targetValue || 100)) *
                      100
                  )}
                  % complete
                </p>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
