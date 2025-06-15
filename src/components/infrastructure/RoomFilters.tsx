
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RoomFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function RoomFilters({ searchTerm, onSearchChange }: RoomFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Rechercher une salle..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-80"
        />
      </div>
    </div>
  );
}
