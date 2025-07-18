
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calendar, 
  Users, 
  GraduationCap,
  Building,
  Layers,
  Route,
  School,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QuickImportAccess } from './QuickImportAccess';

const moduleCards = [
  {
    title: "Programmes",
    description: "Gestion des programmes académiques et spécialisations",
    icon: GraduationCap,
    route: "/academic/programs",
    color: "bg-blue-500"
  },
  {
    title: "Matières",
    description: "Configuration des matières et unités d'enseignement",
    icon: BookOpen,
    route: "/academic/subjects",
    color: "bg-green-500"
  },
  {
    title: "Emplois du temps",
    description: "Planification et gestion des créneaux horaires",
    icon: Calendar,
    route: "/academic/timetables",
    color: "bg-purple-500"
  },
  {
    title: "Groupes de classes",
    description: "Organisation des étudiants en groupes",
    icon: Users,
    route: "/academic/groups",
    color: "bg-orange-500"
  },
  {
    title: "Départements",
    description: "Structure organisationnelle académique",
    icon: Building,
    route: "/academic/departments",
    color: "bg-indigo-500"
  },
  {
    title: "Niveaux",
    description: "Configuration des niveaux d'études",
    icon: Layers,
    route: "/academic/levels",
    color: "bg-teal-500"
  },
  {
    title: "Parcours",
    description: "Définition des parcours de formation",
    icon: Route,
    route: "/academic/pathways",
    color: "bg-pink-500"
  },
  {
    title: "Calendrier",
    description: "Calendrier académique et événements",
    icon: School,
    route: "/academic/calendar",
    color: "bg-red-500"
  }
];

export function AcademicModuleCards() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Modules principaux */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleCards.map((module, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-emerald-500"
                onClick={() => navigate(module.route)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                      <module.icon className={`w-5 h-5 text-emerald-600`} />
                    </div>
                    <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                      {module.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {module.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-3 p-0 h-auto font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    Accéder →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar avec outils d'import */}
        <div className="space-y-6">
          <QuickImportAccess />
          
          {/* Carte d'aide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Commencez par importer les étudiants DUTGE pour avoir des données de test.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Guide de démarrage
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
