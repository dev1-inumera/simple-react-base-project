
import React from "react";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, RefreshCw } from "lucide-react";

interface EmailStatsHeaderProps {
  timeRange: string;
  dateRange: {
    from: Date;
    to: Date;
  };
  onTimeRangeChange: (range: string) => void;
  onDateRangeChange: React.Dispatch<React.SetStateAction<{
    from: Date;
    to: Date;
  }>>;
  onRefresh: () => void;
}

export const EmailStatsHeader: React.FC<EmailStatsHeaderProps> = ({
  timeRange,
  dateRange,
  onTimeRangeChange,
  onDateRangeChange,
  onRefresh
}) => {
  // Handle calendar date selection to ensure both from and to dates are set
  const handleCalendarSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from) {
      onDateRangeChange(currentDateRange => ({
        ...currentDateRange,
        from: range.from || currentDateRange.from,
        to: range.to || range.from // If to is undefined, use from as the end date
      }));
    }
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Statistiques des Emails</h1>
      
      <div className="flex items-center gap-2">
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="90d">3 derniers mois</SelectItem>
            <SelectItem value="6m">6 derniers mois</SelectItem>
            <SelectItem value="1y">Dernière année</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(dateRange.from, "P", { locale: fr })} - {format(dateRange.to, "P", { locale: fr })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{
                from: dateRange.from,
                to: dateRange.to
              }}
              onSelect={handleCalendarSelect}
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          size="icon"
          variant="outline"
          onClick={onRefresh}
          title="Rafraîchir les données"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
