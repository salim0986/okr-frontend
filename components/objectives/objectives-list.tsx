"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function ObjectivesList() {
  const [objectives, setObjectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeaders, user } = useAuth();
  const { toast } = useToast();

  const canEditDelete = ["admin", "org_admin", "dept_manager"].includes(
    user?.role || ""
  );

  useEffect(() => {
    fetchObjectives();
  }, []);

  const fetchObjectives = async () => {
    try {
      const response = await fetch("/api/objectives", {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setObjectives(data);
      }
    } catch (error) {
      console.error("Error fetching objectives:", error);
      toast({
        title: "Error",
        description: "Failed to load objectives.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this objective?")) return;

    try {
      const response = await fetch(`/api/objectives/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      toast({
        title: "Success",
        description: "Objective deleted successfully.",
      });
      fetchObjectives(); // Refresh list
    } catch (error) {
      console.error("Error deleting objective:", error);
      toast({
        title: "Error",
        description: "Failed to delete objective.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (progressValue: number) => {
    if (progressValue >= 90) return "bg-blue-100 text-blue-800"; // Ahead
    if (progressValue >= 70) return "bg-green-100 text-green-800"; // On-track
    if (progressValue >= 40) return "bg-yellow-100 text-yellow-800"; // At-risk
    return "bg-red-100 text-red-800"; // Behind
  };

  const getStatusText = (progressValue: number) => {
    if (progressValue >= 90) return "Ahead";
    if (progressValue >= 70) return "On Track";
    if (progressValue >= 40) return "At Risk";
    return "Behind";
  };

  if (loading) {
    return <div>Loading objectives...</div>;
  }

  return (
    <div className="space-y-4">
      {objectives.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No objectives found. Create your first objective to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        objectives.map((objective) => {
          const totalKeyResults = objective.keyResults?.length || 0;
          const completedKeyResults =
            objective.keyResults?.filter(
              (kr: any) => kr.currentValue >= kr.targetValue
            ).length || 0;
          const overallProgress =
            totalKeyResults > 0
              ? Math.round((completedKeyResults / totalKeyResults) * 100)
              : 0;

          return (
            <Card key={objective.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Link href={`/dashboard/objectives/${objective.id}`}>
                      <CardTitle className="text-lg hover:text-primary cursor-pointer">
                        {objective.objective}
                      </CardTitle>
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{objective.team?.name || "No team"}</span>
                      <span>•</span>
                      <span>
                        {objective.department?.name || "No department"}
                      </span>
                      <span>•</span>
                      <span>
                        {objective.keyResults?.length || 0} Key Results
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(overallProgress)}>
                      {getStatusText(overallProgress)}
                    </Badge>
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
                            onClick={() => handleDelete(objective.id)}
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
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
