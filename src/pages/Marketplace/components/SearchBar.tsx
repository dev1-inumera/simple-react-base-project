
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Rechercher une offre..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 pr-16"
      />
      <Button
        type="submit"
        className="absolute right-0 top-0 rounded-l-none"
        variant="secondary"
        size="sm"
      >
        Rechercher
      </Button>
    </form>
  );
};

export default SearchBar;
