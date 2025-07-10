import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, AlertTriangle, Clock } from 'lucide-react';

export function EmergencyInfo() {
  const emergencyContacts = [
    { name: 'SAMU', number: '15', description: 'Service d\'aide médicale urgente' },
    { name: 'Pompiers', number: '18', description: 'Secours et urgences' },
    { name: 'Police/Gendarmerie', number: '17', description: 'Urgences sécurité' },
    { name: 'Numéro européen', number: '112', description: 'Numéro d\'urgence européen' }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Numéros d'urgence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyContacts.map((contact) => (
              <div key={contact.number} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  {contact.number}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Services médicaux campus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Infirmerie campus</h4>
              <p className="text-sm text-muted-foreground">Bâtiment A - Rez-de-chaussée</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <Phone className="w-4 h-4" />
                  01 23 45 67 89
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  8h30-17h30
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}