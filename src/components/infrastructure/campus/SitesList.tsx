
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Plus, Building } from "lucide-react";
import { useTable } from "@/hooks/useSupabase";
import { SiteForm } from "./SiteForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SitesListProps {
  campusId: string;
}

export function SitesList({ campusId }: SitesListProps) {
  const [isCreateSiteOpen, setIsCreateSiteOpen] = useState(false);
  const { data: sites, refetch: refetchSites } = useTable('sites', '*', { campus_id: campusId });
  const { data: campus } = useTable('campuses');

  const selectedCampus = campus.find(c => c.id === campusId);

  const handleSiteSuccess = () => {
    setIsCreateSiteOpen(false);
    refetchSites();
  };

  if (!selectedCampus) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Sites - {selectedCampus.name}</h3>
        <Dialog open={isCreateSiteOpen} onOpenChange={setIsCreateSiteOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau site</DialogTitle>
            </DialogHeader>
            <SiteForm campusId={campusId} onSuccess={handleSiteSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sites.map((site) => (
          <Card key={site.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                {site.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Code: {site.code}</p>
            </CardHeader>
            <CardContent>
              {site.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {site.address}
                </div>
              )}
              {site.description && (
                <p className="text-sm">{site.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {sites.length === 0 && (
        <div className="text-center py-8">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun site</h4>
          <p className="text-gray-500 mb-4">Ce campus n'a pas encore de sites.</p>
          <Button onClick={() => setIsCreateSiteOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Créer le premier site
          </Button>
        </div>
      )}
    </div>
  );
}
