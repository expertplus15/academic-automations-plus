import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Shield, Calendar, Pill, Activity, AlertTriangle } from 'lucide-react';

export function HealthRecord() {
  const [isEditing, setIsEditing] = useState(false);

  const personalInfo = {
    bloodType: 'A+',
    height: '175 cm',
    weight: '70 kg',
    allergies: ['Pénicilline', 'Noix'],
    chronicConditions: [],
    emergencyContact: {
      name: 'Marie Dupont',
      relationship: 'Mère',
      phone: '06 12 34 56 78'
    },
    doctor: {
      name: 'Dr. Jean Martin',
      specialty: 'Médecin généraliste',
      phone: '01 23 45 67 89',
      address: '15 rue de la Santé, 75014 Paris'
    }
  };

  const medicalHistory = [
    {
      id: 1,
      date: '2024-01-10',
      type: 'consultation',
      title: 'Consultation générale',
      doctor: 'Dr. Jean Martin',
      diagnosis: 'Bilan de santé - RAS',
      treatment: 'Aucun traitement nécessaire',
      notes: 'État de santé général satisfaisant'
    },
    {
      id: 2,
      date: '2023-12-15',
      type: 'vaccination',
      title: 'Vaccin grippe saisonnière',
      doctor: 'Infirmière scolaire',
      notes: 'Vaccination préventive, aucun effet secondaire'
    },
    {
      id: 3,
      date: '2023-11-20',
      type: 'urgence',
      title: 'Entorse cheville',
      doctor: 'Service urgences',
      diagnosis: 'Entorse légère cheville droite',
      treatment: 'Repos, glaçage, antalgiques',
      notes: 'Accident pendant le sport, guérison complète'
    }
  ];

  const vaccinations = [
    { name: 'DTP (Diphtérie, Tétanos, Poliomyélite)', lastDate: '2023-01-15', nextDate: '2033-01-15', status: 'à jour' },
    { name: 'Hépatite B', lastDate: '2022-06-10', nextDate: '2032-06-10', status: 'à jour' },
    { name: 'ROR (Rougeole, Oreillons, Rubéole)', lastDate: '2021-03-20', nextDate: '2031-03-20', status: 'à jour' },
    { name: 'Méningocoque C', lastDate: '2020-09-05', nextDate: '2030-09-05', status: 'à jour' },
    { name: 'Grippe saisonnière', lastDate: '2023-12-15', nextDate: '2024-10-01', status: 'à renouveler' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'vaccination': return 'bg-green-100 text-green-800';
      case 'urgence': return 'bg-red-100 text-red-800';
      case 'examen': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVaccinationStatus = (status: string) => {
    switch (status) {
      case 'à jour': return 'bg-green-100 text-green-800';
      case 'à renouveler': return 'bg-yellow-100 text-yellow-800';
      case 'en retard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerte confidentialité */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-medium">Confidentialité et sécurité</h4>
              <p className="text-sm text-muted-foreground">
                Vos données médicales sont chiffrées et protégées conformément au RGPD. 
                Seuls les professionnels de santé autorisés peuvent y accéder.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="vaccinations" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Vaccinations
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Informations médicales</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Annuler' : 'Modifier'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="height">Taille</Label>
                        <Input id="height" defaultValue="175" />
                      </div>
                      <div>
                        <Label htmlFor="weight">Poids (kg)</Label>
                        <Input id="weight" defaultValue="70" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bloodType">Groupe sanguin</Label>
                      <Input id="bloodType" defaultValue="A+" />
                    </div>
                    <div>
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea 
                        id="allergies" 
                        defaultValue={personalInfo.allergies.join(', ')}
                        placeholder="Listez vos allergies connues..."
                      />
                    </div>
                    <Button>Sauvegarder</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Taille</span>
                        <p className="font-medium">{personalInfo.height}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Poids</span>
                        <p className="font-medium">{personalInfo.weight}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Groupe sanguin</span>
                      <p className="font-medium">{personalInfo.bloodType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Allergies</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {personalInfo.allergies.length > 0 ? (
                          personalInfo.allergies.map((allergy) => (
                            <Badge key={allergy} variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {allergy}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">Aucune allergie connue</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contacts d'urgence */}
            <Card>
              <CardHeader>
                <CardTitle>Contacts d'urgence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Contact principal</h4>
                  <div className="mt-2 space-y-1">
                    <p>{personalInfo.emergencyContact.name}</p>
                    <p className="text-sm text-muted-foreground">{personalInfo.emergencyContact.relationship}</p>
                    <p className="text-sm">{personalInfo.emergencyContact.phone}</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium">Médecin traitant</h4>
                  <div className="mt-2 space-y-1">
                    <p>{personalInfo.doctor.name}</p>
                    <p className="text-sm text-muted-foreground">{personalInfo.doctor.specialty}</p>
                    <p className="text-sm">{personalInfo.doctor.phone}</p>
                    <p className="text-xs text-muted-foreground">{personalInfo.doctor.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {medicalHistory.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <CardDescription>
                      {new Date(entry.date).toLocaleDateString('fr-FR')} - {entry.doctor}
                    </CardDescription>
                  </div>
                  <Badge className={getTypeColor(entry.type)}>
                    {entry.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {entry.diagnosis && (
                  <div>
                    <span className="text-sm font-medium">Diagnostic:</span>
                    <p className="text-sm text-muted-foreground">{entry.diagnosis}</p>
                  </div>
                )}
                {entry.treatment && (
                  <div>
                    <span className="text-sm font-medium">Traitement:</span>
                    <p className="text-sm text-muted-foreground">{entry.treatment}</p>
                  </div>
                )}
                {entry.notes && (
                  <div>
                    <span className="text-sm font-medium">Notes:</span>
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="vaccinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carnet de vaccination</CardTitle>
              <CardDescription>
                Suivi de vos vaccinations et rappels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vaccinations.map((vaccine, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{vaccine.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Dernier: {new Date(vaccine.lastDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Prochain: {new Date(vaccine.nextDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Badge className={getVaccinationStatus(vaccine.status)}>
                      {vaccine.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents médicaux</CardTitle>
              <CardDescription>
                Vos ordonnances, résultats d'examens et certificats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Aucun document</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Vos documents médicaux apparaîtront ici
                </p>
                <Button className="mt-4">
                  Télécharger un document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}