
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface ClientCardProps {
  client: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    createdAt: string;
  };
  onSelect: (clientId: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onSelect }) => {
  return (
    <Card className="elevated-card interactive-element">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">
            {client.firstName} {client.lastName}
          </CardTitle>
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <p className="text-sm">
            <span className="text-muted-foreground">Email: </span>
            {client.email}
          </p>
          {client.phone && (
            <p className="text-sm">
              <span className="text-muted-foreground">Téléphone: </span>
              {client.phone}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Client depuis {new Date(client.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <Button className="modern-button" size="sm" onClick={() => onSelect(client.id)}>
          Voir détails
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
