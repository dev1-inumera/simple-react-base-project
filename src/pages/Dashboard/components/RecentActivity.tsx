
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivity {
  id: string;
  type: string;
  name: string;
  date: string;
  status?: string;
}

interface RecentActivityProps {
  activities: RecentActivity[];
  loading: boolean;
}

export const RecentActivityList: React.FC<RecentActivityProps> = ({
  activities,
  loading,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>
          Les dernières activités sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-2 border-b">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-48"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
                <div className="h-6 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 border-b">
                <div>
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                {activity.status && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : activity.status === "approved"
                        ? "bg-blue-100 text-blue-800"
                        : activity.status === "sent"
                        ? "bg-purple-100 text-purple-800"
                        : activity.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : activity.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activity.status === "pending"
                      ? "En attente"
                      : activity.status === "approved"
                      ? "Approuvé"
                      : activity.status === "sent"
                      ? "Envoyé"
                      : activity.status === "accepted"
                      ? "Accepté"
                      : activity.status === "rejected"
                      ? "Rejeté"
                      : activity.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Aucune activité récente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
