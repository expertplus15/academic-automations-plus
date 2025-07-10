import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export function MyActivities() {
  const [selectedTab, setSelectedTab] = useState('active');

  const enrollments = [
    {
      id: 1,
      activityTitle: 'Football Universitaire',
      category: 'sport',
      status: 'active',
      enrollmentDate: '2024-09-15',
      nextSession: '2024-01-16 18:00',
      location: 'Terrain de football',
      participationRate: 85,
      totalSessions: 24,
      attendedSessions: 20,
      paymentStatus: 'paid',
      instructor: 'Coach Martin'
    },
    {
      id: 2,
      activityTitle: 'Club de Théâtre',
      category: 'culture',
      status: 'active',
      enrollmentDate: '2024-09-20',
      nextSession: '2024-01-17 17:00',
      location: 'Salle de théâtre',
      participationRate: 92,
      totalSessions: 16,
      attendedSessions: 15,
      paymentStatus: 'paid',
      instructor: 'Marie Dubois'
    },
    {
      id: 3,
      activityTitle: 'Natation',
      category: 'sport',
      status: 'completed',
      enrollmentDate: '2024-02-10',
      completionDate: '2024-06-15',
      location: 'Piscine universitaire',
      participationRate: 78,
      totalSessions: 30,
      attendedSessions: 23,
      paymentStatus: 'paid',
      instructor: 'Sarah Laurent'
    },
    {
      id: 4,
      activityTitle: 'Association Humanitaire',
      category: 'associatif',
      status: 'pending',
      enrollmentDate: '2024-01-10',
      approvalPending: true,
      location: 'Variable',
      paymentStatus: 'not_required',
      instructor: 'Bureau de l\'association'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sport': return 'bg-blue-100 text-blue-800';
      case 'culture': return 'bg-purple-100 text-purple-800';
      case 'associatif': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'not_required': return <CheckCircle className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    if (selectedTab === 'active') return enrollment.status === 'active';
    if (selectedTab === 'completed') return enrollment.status === 'completed';
    if (selectedTab === 'pending') return enrollment.status === 'pending';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Onglets */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'active', label: 'Actives', count: enrollments.filter(e => e.status === 'active').length },
          { key: 'completed', label: 'Terminées', count: enrollments.filter(e => e.status === 'completed').length },
          { key: 'pending', label: 'En attente', count: enrollments.filter(e => e.status === 'pending').length }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={selectedTab === tab.key ? 'default' : 'ghost'}
            onClick={() => setSelectedTab(tab.key)}
            className="text-sm"
          >
            {tab.label} ({tab.count})
          </Button>
        ))}
      </div>

      {/* Liste des inscriptions */}
      <div className="grid gap-6">
        {filteredEnrollments.map((enrollment) => (
          <Card key={enrollment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(enrollment.category)}>
                      {enrollment.category}
                    </Badge>
                    <Badge className={getStatusColor(enrollment.status)}>
                      {enrollment.status === 'active' ? 'Active' :
                       enrollment.status === 'completed' ? 'Terminée' :
                       enrollment.status === 'pending' ? 'En attente' : enrollment.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{enrollment.activityTitle}</CardTitle>
                  <CardDescription>
                    Inscrit le {new Date(enrollment.enrollmentDate).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getPaymentStatusIcon(enrollment.paymentStatus)}
                  <span className="text-sm">
                    {enrollment.paymentStatus === 'paid' ? 'Payé' :
                     enrollment.paymentStatus === 'pending' ? 'En attente' :
                     enrollment.paymentStatus === 'not_required' ? 'Gratuit' : 'Impayé'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{enrollment.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>Instructeur: {enrollment.instructor}</span>
                  </div>
                  {enrollment.nextSession && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Prochaine séance: {new Date(enrollment.nextSession).toLocaleString('fr-FR')}</span>
                    </div>
                  )}
                </div>

                {enrollment.participationRate && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Taux de participation</span>
                        <span>{enrollment.participationRate}%</span>
                      </div>
                      <Progress value={enrollment.participationRate} className="h-2" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {enrollment.attendedSessions}/{enrollment.totalSessions} séances
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {enrollment.status === 'active' && (
                  <>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Planning
                    </Button>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </>
                )}
                {enrollment.status === 'pending' && enrollment.approvalPending && (
                  <Button variant="outline" size="sm" disabled>
                    <Clock className="w-4 h-4 mr-2" />
                    En attente d'approbation
                  </Button>
                )}
                {enrollment.status === 'completed' && (
                  <Button variant="outline" size="sm">
                    Certificat
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEnrollments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {selectedTab === 'active' && 'Vous n\'êtes inscrit à aucune activité active'}
            {selectedTab === 'completed' && 'Aucune activité terminée'}
            {selectedTab === 'pending' && 'Aucune inscription en attente'}
          </div>
        </div>
      )}
    </div>
  );
}