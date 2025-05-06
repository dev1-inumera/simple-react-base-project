
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, BarChart2, MousePointerClick } from "lucide-react";

interface EmailStatsCardProps {
  title: string;
  description: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function EmailStatsCard({
  title,
  description,
  value,
  unit = "",
  icon,
  loading = false,
  className,
}: EmailStatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon || <Mail className="h-4 w-4" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <>
              {typeof value === 'number' ? value.toLocaleString() : value}
              {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function EmailChartCard({ 
  title, 
  children,
  loading = false, 
  className 
}: { 
  title: string; 
  children: React.ReactNode;
  loading?: boolean;
  className?: string; 
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          <BarChart2 className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full aspect-[2/1]">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
