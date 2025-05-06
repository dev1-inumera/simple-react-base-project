
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailActivity } from "@/services/EmailService";

interface EmailActivityTableProps {
  activities: EmailActivity[];
  loading: boolean;
}

export function EmailActivityTable({ activities, loading }: EmailActivityTableProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Livré</Badge>;
      case 'opened':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Ouvert</Badge>;
      case 'clicked':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Cliqué</Badge>;
      case 'bounced':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejeté</Badge>;
      case 'deferred':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'processed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Traité</Badge>;
      case 'dropped':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Abandonné</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité des Emails</CardTitle>
        <CardDescription>Historique récent des emails envoyés</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinataire</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Ouvertures</TableHead>
                <TableHead>Clics</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(null).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  </TableRow>
                ))
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.to_email}</TableCell>
                    <TableCell>{activity.subject}</TableCell>
                    <TableCell>{getStatusBadge(activity.status)}</TableCell>
                    <TableCell>{activity.opens_count}</TableCell>
                    <TableCell>{activity.clicks_count}</TableCell>
                    <TableCell>{formatDate(activity.created)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    Aucune activité d'email à afficher
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
