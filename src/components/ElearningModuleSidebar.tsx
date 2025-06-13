import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Monitor,
  Settings,
  Edit,
  Video,
  Play,
  MessageCircle,
  Award,
  BarChart,
  ArrowLeft,
} from "lucide-react";

const elearningSubModules = [
  {
    title: "Standards SCORM/xAPI",
    url: "/elearning/standards",
    icon: Settings,
    description: "H5P, LTI, QTI compatibles"
  },
  {
    title: "Authoring WYSIWYG",
    url: "/elearning/authoring",
    icon: Edit,
    description: "Création contenu avancée"
  },
  {
    title: "Classes virtuelles",
    url: "/elearning/virtual-classes",
    icon: Video,
    description: "Zoom, Teams, WebRTC"
  },
  {
    title: "Streaming vidéo",
    url: "/elearning/streaming",
    icon: Play,
    description: "Adaptatif - qualité optimale"
  },
  {
    title: "Forums discussion",
    url: "/elearning/forums",
    icon: MessageCircle,
    description: "Collaboration étudiante"
  },
  {
    title: "Gamification",
    url: "/elearning/gamification",
    icon: Award,
    description: "Badges, points, niveaux"
  },
  {
    title: "Analytics engagement",
    url: "/elearning/analytics",
    icon: BarChart,
    description: "Détaillés - insights"
  },
];

export function ElearningModuleSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-elearning rounded-lg flex items-center justify-center">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">eLearning</h1>
            <p className="text-xs text-muted-foreground">& Formation</p>
          </div>
        </div>
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Fonctionnalités</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {elearningSubModules.map((subModule) => {
                const Icon = subModule.icon;
                const isActive = location.pathname === subModule.url;
                
                return (
                  <SidebarMenuItem key={subModule.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={subModule.url}
                        className={cn(
                          "group flex items-start gap-3 p-3 rounded-lg transition-all hover:scale-[1.02]",
                          isActive && "bg-sidebar-accent"
                        )}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all group-hover:scale-110"
                          style={{ backgroundColor: "rgb(var(--elearning))" }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-sidebar-foreground truncate">
                            {subModule.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {subModule.description}
                          </p>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="text-xs text-muted-foreground">
          <p>Academic+ v1.0</p>
          <p>© 2025 MyAcademics</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}