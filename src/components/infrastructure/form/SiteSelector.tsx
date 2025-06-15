
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTable } from "@/hooks/useSupabase";
import { useState, useEffect } from "react";

interface SiteSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SiteSelector({ value, onChange, error }: SiteSelectorProps) {
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const { data: campuses } = useTable('campuses');
  const { data: sites } = useTable('sites', '*', selectedCampus ? { campus_id: selectedCampus } : undefined);

  // Load campus for current site when editing
  useEffect(() => {
    if (value && sites.length > 0) {
      const currentSite = sites.find(site => site.id === value);
      if (currentSite && currentSite.campus_id !== selectedCampus) {
        setSelectedCampus(currentSite.campus_id);
      }
    }
  }, [value, sites, selectedCampus]);

  const handleCampusChange = (campusId: string) => {
    setSelectedCampus(campusId);
    onChange(''); // Reset site selection when campus changes
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Campus</Label>
        <Select value={selectedCampus} onValueChange={handleCampusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un campus" />
          </SelectTrigger>
          <SelectContent>
            {campuses.map((campus) => (
              <SelectItem key={campus.id} value={campus.id}>
                {campus.name} ({campus.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Site</Label>
        <Select value={value} onValueChange={onChange} disabled={!selectedCampus}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un site" />
          </SelectTrigger>
          <SelectContent>
            {sites.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name} ({site.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
