import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Activity, 
  Users,
  Home
} from 'lucide-react';

interface ContextualBreadcrumbsProps {
  currentPage: 'dashboard' | 'analytics' | 'cards';
  activeFilters?: {
    dateRange?: string;
    program?: string;
    status?: string;
  };
}

export function ContextualBreadcrumbs({ currentPage, activeFilters }: ContextualBreadcrumbsProps) {
  const getPageInfo = () => {
    switch (currentPage) {
      case 'dashboard':
        return { 
          title: 'Suivi Temps Réel', 
          icon: Activity,
          description: 'Vue opérationnelle des inscriptions'
        };
      case 'analytics':
        return { 
          title: 'Analytics', 
          icon: BarChart3,
          description: 'Analyses et tendances'
        };
      case 'cards':
        return { 
          title: 'Cartes Étudiants', 
          icon: Users,
          description: 'Gestion des cartes'
        };
      default:
        return { title: 'Inscriptions', icon: Home, description: '' };
    }
  };

  const pageInfo = getPageInfo();
  const IconComponent = pageInfo.icon;

  return (
    <div className="space-y-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/students">
              <Home className="w-4 h-4" />
              Étudiants
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/students/registration">
              Inscription
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2">
              <IconComponent className="w-4 h-4" />
              {pageInfo.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{pageInfo.description}</p>
        
        {activeFilters && Object.keys(activeFilters).length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filtres actifs:</span>
            {activeFilters.dateRange && (
              <Badge variant="secondary" className="text-xs">
                {activeFilters.dateRange}
              </Badge>
            )}
            {activeFilters.program && (
              <Badge variant="secondary" className="text-xs">
                {activeFilters.program}
              </Badge>
            )}
            {activeFilters.status && (
              <Badge variant="secondary" className="text-xs">
                {activeFilters.status}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}