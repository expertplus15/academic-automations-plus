import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Calendar,
  FileText,
  ExternalLink
} from 'lucide-react';

interface PartnerDetailsModalProps {
  partner: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PartnerDetailsModal({ partner, open, onOpenChange }: PartnerDetailsModalProps) {
  if (!partner) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'STAGE': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'EMPLOI': return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'PARTENARIAT': return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'FOURNISSEUR': return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      default: return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIF': return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'INACTIF': return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
      case 'PROSPECT': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'CLIENT': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default: return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Building className="h-5 w-5" />
            {partner.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Entreprise:</span>
                <span>{partner.company}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Secteur:</span>
                <span>{partner.sector}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Type:</span>
                <Badge className={getTypeColor(partner.type)}>
                  {partner.type}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Statut:</span>
                <Badge className={getStatusColor(partner.status)}>
                  {partner.status}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-medium">Créé le:</span>
                <span>{new Date(partner.created_at).toLocaleDateString('fr-FR')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Mis à jour:</span>
                <span>{new Date(partner.updated_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partner.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{partner.email}</p>
                  </div>
                </div>
              )}

              {partner.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">{partner.phone}</p>
                  </div>
                </div>
              )}

              {partner.address && (partner.address.street || partner.address.city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">Adresse</p>
                    <div className="text-sm text-muted-foreground">
                      {partner.address.street && <p>{partner.address.street}</p>}
                      {(partner.address.postal_code || partner.address.city) && (
                        <p>
                          {partner.address.postal_code} {partner.address.city}
                        </p>
                      )}
                      {partner.address.country && <p>{partner.address.country}</p>}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Person */}
          {partner.contact_person && (partner.contact_person.name || partner.contact_person.email) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personne de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {partner.contact_person.name && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{partner.contact_person.name}</p>
                      {partner.contact_person.position && (
                        <p className="text-sm text-muted-foreground">{partner.contact_person.position}</p>
                      )}
                    </div>
                  </div>
                )}

                {partner.contact_person.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{partner.contact_person.email}</p>
                    </div>
                  </div>
                )}

                {partner.contact_person.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">{partner.contact_person.phone}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {partner.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                  <p className="text-sm">{partner.notes}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {partner.email && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${partner.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Envoyer un email
                  </a>
                </Button>
              )}

              {partner.phone && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`tel:${partner.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </a>
                </Button>
              )}

              {partner.contact_person?.email && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`mailto:${partner.contact_person.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contacter {partner.contact_person.name}
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}