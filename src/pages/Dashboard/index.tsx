
import React from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/lib/auth";
import ClientDashboard from "./ClientDashboard";
import AgentDashboard from "./AgentDashboard";
import AdminDashboard from "./AdminDashboard";

const Dashboard: React.FC = () => {
  const { auth } = useAuth();

  if (!auth.user) {
    return null;
  }

  switch (auth.user.role) {
    case UserRole.CLIENT:
      return <ClientDashboard />;
    case UserRole.AGENT:
      return <AgentDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    default:
      return <ClientDashboard />;
  }
};

export default Dashboard;
