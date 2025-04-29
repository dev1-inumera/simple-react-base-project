
import React from 'react';
import { DashboardStats } from './DashboardStats';

interface DashboardHeaderProps {
  foldersCount: number;
  pendingQuotesCount: number;
  loading: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  foldersCount, 
  pendingQuotesCount, 
  loading 
}) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      <div className="w-full">
        <DashboardStats 
          stats={[
            { 
              title: "Projets actifs", 
              value: foldersCount, 
              description: "Dossiers en cours", 
              icon: null 
            },
            { 
              title: "Devis en attente", 
              value: pendingQuotesCount, 
              description: "À approuver", 
              icon: null 
            },
            { 
              title: "Projets complétés", 
              value: 0, 
              description: "Dossiers fermés", 
              icon: null 
            }
          ]}
          loading={loading}
        />
      </div>
    </>
  );
};
