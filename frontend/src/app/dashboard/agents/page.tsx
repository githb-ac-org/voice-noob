"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Bot, MoreVertical, Play, Pause, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { agentApi, type VoiceAgentResponse } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export default function AgentsPage() {
  const [agents, setAgents] = useState<VoiceAgentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setIsLoading(true);
    try {
      const data = await agentApi.list();
      setAgents(data);
    } catch (error) {
      console.error("Failed to load agents:", error);
      toast({
        title: "Failed to load agents",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setIsDeleting(id);
    try {
      await agentApi.delete(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "Agent deleted",
        description: `${name} has been deleted successfully`,
      });
    } catch (error) {
      console.error("Failed to delete agent:", error);
      toast({
        title: "Failed to delete agent",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  }

  async function handleToggleStatus(agent: VoiceAgentResponse) {
    try {
      await agentApi.update(agent.id, { is_active: !agent.is_active });
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agent.id ? { ...a, is_active: !a.is_active } : a
        )
      );
      toast({
        title: `Agent ${agent.is_active ? "deactivated" : "activated"}`,
        description: `${agent.name} is now ${agent.is_active ? "inactive" : "active"}`,
      });
    } catch (error) {
      console.error("Failed to toggle agent status:", error);
      toast({
        title: "Failed to update status",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voice Agents</h1>
          <p className="text-muted-foreground">Manage and configure your AI voice agents</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/agents/new-simplified">
            <Plus className="mr-2 h-4 w-4" />
            Create Agent
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : agents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bot className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No voice agents yet</h3>
            <p className="mb-4 max-w-sm text-center text-sm text-muted-foreground">
              Create your first voice agent to handle inbound and outbound calls with AI
            </p>
            <Button asChild>
              <Link href="/dashboard/agents/new-simplified">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Agent
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{agent.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {agent.pricing_tier.charAt(0).toUpperCase() +
                          agent.pricing_tier.slice(1)}{" "}
                        Tier
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting === agent.id}
                      >
                        {isDeleting === agent.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleStatus(agent)}>
                        {agent.is_active ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/test?agent=${agent.id}`}>
                          Test Agent
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(agent.id, agent.name)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={agent.is_active ? "default" : "secondary"}>
                      {agent.is_active ? (
                        <>
                          <Play className="mr-1 h-3 w-3" /> Active
                        </>
                      ) : (
                        <>
                          <Pause className="mr-1 h-3 w-3" /> Inactive
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Phone Number</span>
                    <span className="font-mono text-xs">
                      {agent.phone_number_id ? `+1 (XXX) XXX-XXXX` : "Not assigned"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span className="text-xs">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {agent.description && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {agent.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
