import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, GraduationCap, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Department {
  id: string;
  name: string;
  code: string;
  head_id?: string;
  created_at: string;
}

interface DepartmentsListProps {
  departments: Department[] | undefined;
}

export function DepartmentsList({ departments }: DepartmentsListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Départements</CardTitle>
          <Button asChild>
            <Link to="/academic/departments/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Département
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments?.map((department) => (
            <Card key={department.id} className="border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{department.name}</h3>
                      <p className="text-sm text-muted-foreground">{department.code}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Enseignants</span>
                    </div>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Programmes</span>
                    </div>
                    <Badge variant="secondary">3</Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full" size="sm" asChild>
                    <Link to={`/academic/departments/${department.id}`}>
                      Voir Détails
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {(!departments || departments.length === 0) && (
            <div className="col-span-full text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Aucun département configuré
              </p>
              <Button asChild>
                <Link to="/academic/departments/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le premier département
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}