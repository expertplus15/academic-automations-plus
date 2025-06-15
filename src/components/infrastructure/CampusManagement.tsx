
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin, Plus } from "lucide-react";
import { useTable } from "@/hooks/useSupabase";
import { CampusForm } from "./campus/CampusForm";
import { SitesList } from "./campus/SitesList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function CampusManagement() {
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [isCreateCampusOpen, setIsCreateCampusOpen] = useState(false);
  const { data: campuses, refetch: refetchCampuses } = useTable('campuses');

  const handleCampusSuccess = () => {
    setIsCreateCampusOpen(false);
    refetchCampuses();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion Campus & Sites</h2>
        <Dialog open={isCreateCampusOpen} onOpenChange={setIsCreateCampusOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Campus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau campus</DialogTitle>
            </DialogHeader>
            <CampusForm onSuccess={handleCampusSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campuses.map((campus) => (
          <Card 
            key={campus.id} 
            className={`cursor-pointer transition-all ${selectedCampus === campus.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedCampus(selectedCampus === campus.id ? null : campus.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                {campus.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Code: {campus.code}</p>
            </CardHeader>
            <CardContent>
              {campus.address && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  {campus.address}
                </div>
              )}
              {campus.description && (
                <p className="text-sm">{campus.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCampus && (
        <SitesList campusId={selectedCampus} />
      )}
    </div>
  );
}
