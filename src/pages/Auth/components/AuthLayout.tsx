
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Star, Users } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footer?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description, footer }) => {
  const { auth } = useAuth();
  
  // Redirect to dashboard if already authenticated
  if (auth.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 text-white/20 animate-pulse">
        <Star size={40} />
      </div>
      <div className="absolute bottom-20 right-20 text-white/20 animate-pulse" style={{ animationDelay: '1s' }}>
        <Star size={24} />
      </div>
      <div className="absolute top-1/3 right-1/4 text-white/10 animate-pulse" style={{ animationDelay: '1.5s' }}>
        <Users size={32} />
      </div>
      
      <div className="absolute top-0 left-0 p-4 z-10">
        <h1 className="text-2xl font-bold">
          <span className="text-[#bb0c19]">i</span>
          <span className="text-white">-numa</span>
        </h1>
      </div>
      
      <Card className="w-full max-w-md z-10 bg-white/70 backdrop-blur-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </div>
  );
};

export default AuthLayout;
