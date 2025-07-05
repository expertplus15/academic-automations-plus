import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StudentCard } from '@/hooks/students/useStudentCards';
import { CreditCard, Download, Eye, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CardsDataTableProps {
  cards: StudentCard[];
  loading: boolean;
}

export function CardsDataTable({ cards, loading }: CardsDataTableProps) {
  const getStatusBadge = (status: string, isPrinted: boolean) => {
    if (status === 'active' && !isPrinted) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">À imprimer</Badge>;
    }
    if (status === 'active' && isPrinted) {
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Active</Badge>;
    }
    if (status === 'expired') {
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Expirée</Badge>;
    }
    if (status === 'suspended') {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Suspendue</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Chargement des cartes...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Aucune carte trouvée
            </h3>
            <p className="text-muted-foreground">
              Commencez par générer des cartes pour les étudiants actifs.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Cartes Étudiants ({cards.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">Étudiant</th>
                <th className="pb-3 font-medium text-muted-foreground">Numéro de carte</th>
                <th className="pb-3 font-medium text-muted-foreground">Programme</th>
                <th className="pb-3 font-medium text-muted-foreground">Date d'émission</th>
                <th className="pb-3 font-medium text-muted-foreground">Expiration</th>
                <th className="pb-3 font-medium text-muted-foreground">Statut</th>
                <th className="pb-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {cards.map((card) => (
                <tr key={card.id} className="hover:bg-muted/30">
                  <td className="py-3">
                    <div>
                      <div className="font-medium">{card.students.profiles.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {card.students.student_number}
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-mono text-sm font-medium">
                      {card.card_number}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="text-sm">{card.students.programs.name}</div>
                  </td>
                  <td className="py-3">
                    <div className="text-sm">
                      {format(new Date(card.issue_date), 'dd/MM/yyyy', { locale: fr })}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="text-sm">
                      {card.expiry_date 
                        ? format(new Date(card.expiry_date), 'dd/MM/yyyy', { locale: fr })
                        : 'N/A'
                      }
                    </div>
                  </td>
                  <td className="py-3">
                    {getStatusBadge(card.status, card.is_printed)}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Voir la carte"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Code QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Télécharger PDF"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}