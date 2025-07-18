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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";

interface CreateKeyResultDialogProps {
  children: React.ReactNode;
  objectiveId?: string;
  onSuccess?: () => void;
}

export function CreateKeyResultDialog({
  children,
  objectiveId,
  onSuccess,
}: CreateKeyResultDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [objectives, setObjectives] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetValue: "",
    currentValue: "0",
    objectiveId: objectiveId || "",
  });
  const { toast } = useToast();
  const { getAuthHeaders, user } = useAuth();

  useEffect(() => {
    if (open && !objectiveId) {
      fetchObjectives();
    }
  }, [open, objectiveId]);

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
        description: "Failed to load objectives for key result creation.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/key-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...formData,
          targetValue: Number(formData.targetValue),
          currentValue: Number(formData.currentValue),
          createdById: user?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create key result");

      toast({
        title: "Success",
        description: "Key result created successfully",
      });

      setOpen(false);
      setFormData({
        title: "",
        description: "",
        targetValue: "",
        currentValue: "0",
        objectiveId: objectiveId || "",
      });
      onSuccess?.();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create key result",
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
          <DialogTitle>Create New Key Result</DialogTitle>
          <DialogDescription>
            Add a measurable key result to track progress towards your
            objective.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter key result title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the key result"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          {!objectiveId && (
            <div className="space-y-2">
              <Label htmlFor="objective">Objective</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, objectiveId: value })
                }
                value={formData.objectiveId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map((objective) => (
                    <SelectItem key={objective.id} value={objective.id}>
                      {objective.objective}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value</Label>
              <Input
                id="currentValue"
                type="number"
                placeholder="0"
                value={formData.currentValue}
                onChange={(e) =>
                  setFormData({ ...formData, currentValue: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target Value</Label>
              <Input
                id="targetValue"
                type="number"
                placeholder="100"
                value={formData.targetValue}
                onChange={(e) =>
                  setFormData({ ...formData, targetValue: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Key Result"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
