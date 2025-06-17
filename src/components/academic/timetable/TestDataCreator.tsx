
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Database } from 'lucide-react';

export function TestDataCreator() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createTestData = async () => {
    setIsLoading(true);
    try {
      // Créer un campus de test
      const { data: campus } = await supabase
        .from('campuses')
        .insert({ name: 'Campus Principal', code: 'CP01' })
        .select()
        .single();

      // Créer un site de test
      const { data: site } = await supabase
        .from('sites')
        .insert({ 
          name: 'Bâtiment A', 
          code: 'BA01',
          campus_id: campus.id 
        })
        .select()
        .single();

      // Créer quelques salles de test
      const rooms = [
        { name: 'Salle 101', code: 'S101', capacity: 30, room_type: 'classroom', site_id: site.id },
        { name: 'Salle 102', code: 'S102', capacity: 25, room_type: 'classroom', site_id: site.id },
        { name: 'Labo Info', code: 'LAB01', capacity: 20, room_type: 'laboratory', site_id: site.id }
      ];

      await supabase.from('rooms').insert(rooms);

      // Créer un département de test
      const { data: department } = await supabase
        .from('departments')
        .insert({ name: 'Informatique', code: 'INFO' })
        .select()
        .single();

      // Créer un niveau académique de test
      const { data: level } = await supabase
        .from('academic_levels')
        .insert({ 
          name: 'Licence', 
          code: 'L', 
          education_cycle: 'undergraduate',
          order_index: 1,
          duration_years: 3
        })
        .select()
        .single();

      // Créer un programme de test
      const { data: program } = await supabase
        .from('programs')
        .insert({ 
          name: 'Licence Informatique', 
          code: 'LIC-INFO',
          department_id: department.id,
          level_id: level.id,
          duration_years: 3
        })
        .select()
        .single();

      // Créer quelques matières de test
      const subjects = [
        { name: 'Programmation', code: 'PROG101', credits_ects: 6, program_id: program.id },
        { name: 'Mathématiques', code: 'MATH101', credits_ects: 4, program_id: program.id },
        { name: 'Base de données', code: 'BDD101', credits_ects: 5, program_id: program.id }
      ];

      await supabase.from('subjects').insert(subjects);

      // Créer quelques enseignants de test
      const teachers = [
        { 
          email: 'prof.martin@test.fr', 
          full_name: 'Dr. Martin Dupont', 
          role: 'teacher',
          department_id: department.id
        },
        { 
          email: 'prof.durand@test.fr', 
          full_name: 'Dr. Claire Durand', 
          role: 'teacher',
          department_id: department.id
        }
      ];

      await supabase.from('profiles').insert(teachers);

      // Créer une année académique
      const currentYear = new Date().getFullYear();
      await supabase.from('academic_years').insert({
        name: `${currentYear}-${currentYear + 1}`,
        start_date: `${currentYear}-09-01`,
        end_date: `${currentYear + 1}-06-30`,
        is_current: true
      });

      toast({
        title: "Données de test créées",
        description: "Les données de base ont été créées avec succès",
      });

    } catch (error) {
      console.error('Error creating test data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la création des données de test",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Données de test manquantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Il semble qu'il n'y ait pas encore de données de base (matières, salles, enseignants). 
          Voulez-vous créer des données de test pour commencer ?
        </p>
        <Button onClick={createTestData} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          {isLoading ? 'Création en cours...' : 'Créer des données de test'}
        </Button>
      </CardContent>
    </Card>
  );
}
