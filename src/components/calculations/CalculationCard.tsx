import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Check, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "idle" | "running" | "completed" | "error";
  progress?: number;
  lastRun?: string;
  resultCount?: number;
  onExecute?: () => void;
  onConfigure?: () => void;
  disabled?: boolean;
}

const statusConfig = {
  idle: {
    color: "secondary",
    icon: Clock,
    text: "En attente"
  },
  running: {
    color: "default",
    icon: Loader2,
    text: "En cours..."
  },
  completed: {
    color: "success",
    icon: Check,
    text: "Terminé"
  },
  error: {
    color: "destructive",
    icon: AlertTriangle,
    text: "Erreur"
  }
};

export function CalculationCard({
  title,
  description,
  icon,
  status,
  progress,
  lastRun,
  resultCount,
  onExecute,
  onConfigure,
  disabled = false
}: CalculationCardProps) {
  const StatusIcon = statusConfig[status].icon;
  
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            {icon}
            {title}
          </CardTitle>
          <Badge 
            variant={statusConfig[status].color as any}
            className="flex items-center gap-1"
          >
            <StatusIcon className={cn(
              "w-3 h-3",
              status === "running" && "animate-spin"
            )} />
            {statusConfig[status].text}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        
        {status === "running" && progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {(lastRun || resultCount !== undefined) && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
            {lastRun && (
              <div className="text-xs">
                <span className="text-muted-foreground">Dernière exécution</span>
                <div className="font-medium">{lastRun}</div>
              </div>
            )}
            {resultCount !== undefined && (
              <div className="text-xs">
                <span className="text-muted-foreground">Résultats</span>
                <div className="font-medium">{resultCount.toLocaleString()}</div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onExecute}
            disabled={disabled || status === "running"}
            className="flex-1"
            size="sm"
          >
            {status === "running" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                En cours...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Exécuter
              </>
            )}
          </Button>
          
          {onConfigure && (
            <Button
              onClick={onConfigure}
              variant="outline"
              size="sm"
              disabled={status === "running"}
            >
              Config
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}