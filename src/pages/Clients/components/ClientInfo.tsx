
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, Mail, Phone, MapPin, CalendarDays } from "lucide-react";
import { User } from "@/types";

interface ClientInfoProps {
  client: User | null;
  loading: boolean;
  onCreateFolder: () => void;
  creatingFolder: boolean;
}

const ClientInfo: React.FC<ClientInfoProps> = ({
  client,
  loading,
  onCreateFolder,
  creatingFolder,
}) => {
  if (loading) {
    return (
      <Card className="mb-6 animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </CardContent>
      </Card>
    );
  }

  if (!client) {
    return (
      <Card className="mb-6">
        <CardContent>
          <p className="text-center text-muted-foreground">Client non trouvé</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">
          {client.firstName} {client.lastName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="flex items-center text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              {client.email}
            </p>

            {client.phone && (
              <p className="flex items-center text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                {client.phone}
              </p>
            )}

            {client.address && (
              <p className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {client.address}
              </p>
            )}

            {client.birthDate && (
              <p className="flex items-center text-muted-foreground">
                <CalendarDays className="h-4 w-4 mr-2" />
                {new Date(client.birthDate).toLocaleDateString()}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-end">
              <Button onClick={onCreateFolder} disabled={creatingFolder}>
                <FolderOpen className="h-4 w-4 mr-2" />
                Créer un dossier
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfo;
