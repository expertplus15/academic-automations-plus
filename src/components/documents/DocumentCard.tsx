import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Edit, Share, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  title: string;
  description: string;
  type: "bulletin" | "transcript" | "template";
  status?: "draft" | "ready" | "generated";
  lastGenerated?: string;
  studentCount?: number;
  onPreview?: () => void;
  onGenerate?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
}

export function DocumentCard({
  title,
  description,
  type,
  status = "ready",
  lastGenerated,
  studentCount,
  onPreview,
  onGenerate,
  onEdit,
  onShare
}: DocumentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "secondary";
      case "ready": return "default";
      case "generated": return "default";
      default: return "secondary";
    }
  };

  const getTypeIcon = () => {
    // Retourne juste le type pour l'instant
    return type;
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">{title}</CardTitle>
            <Badge variant={getStatusColor(status)} className="text-xs">
              {status === "draft" && "Brouillon"}
              {status === "ready" && "Prêt"}
              {status === "generated" && "Généré"}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Partager
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        {(lastGenerated || studentCount) && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            {lastGenerated && (
              <span>Dernière génération: {lastGenerated}</span>
            )}
            {studentCount && (
              <span>{studentCount} étudiants</span>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {onPreview && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onPreview}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Aperçu
            </Button>
          )}
          
          {onGenerate && (
            <Button 
              size="sm" 
              onClick={onGenerate}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-1" />
              {type === "template" ? "Utiliser" : "Générer"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}