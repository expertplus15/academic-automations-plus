import { Outlet, useLocation } from 'react-router-dom';
import { AcademicModuleSidebar } from '@/components/AcademicModuleSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const routeToBreadcrumbs: Record<string, BreadcrumbItem[]> = {
  '/academic': [{ label: 'Tableau de bord' }],
  '/academic/programs': [{ label: 'Tableau de bord', href: '/academic' }, { label: 'Programmes' }],
  '/academic/pathways': [{ label: 'Tableau de bord', href: '/academic' }, { label: 'Filières' }],
  '/academic/levels': [{ label: 'Tableau de bord', href: '/academic' }, { label: 'Niveaux' }],
  '/academic/groups': [{ label: 'Tableau de bord', href: '/academic' }, { label: 'Classes' }],
  '/academic/subjects': [{ label: 'Tableau de bord', href: '/academic' }, { label: 'Matières' }],
  '/academic/infrastructure': [{ label: 'Tableau de bord', href: '/academic' }, { label: 'Infrastructures' }],
  '/academic/timetables': [{ label: 'Tableau de bord', href: '/academic' }, { label: 'Emploi du temps' }],
  '/academic/evaluations': [{ label: 'Tableau de bord', href: '/academic' }, { label: 'Évaluations' }],
};

export function AcademicLayout() {
  const location = useLocation();
  const breadcrumbs = routeToBreadcrumbs[location.pathname] || [{ label: 'Tableau de bord' }];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AcademicModuleSidebar />
        <main className="flex-1 flex flex-col">
          {/* Header unifié */}
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour au tableau de bord
                  </Link>
                </Button>
                
                {/* Breadcrumb */}
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/academic">Académique</BreadcrumbLink>
                    </BreadcrumbItem>
                    {breadcrumbs.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {item.href ? (
                            <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                      </div>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>
          </header>

          {/* Contenu principal */}
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}