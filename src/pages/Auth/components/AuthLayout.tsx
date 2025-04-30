
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footer?: React.ReactNode;
  showBackground?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  description, 
  footer,
  showBackground = true 
}) => {
  const { auth } = useAuth();
  
  // Redirect to dashboard if already authenticated
  if (auth.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#1A1F2C] text-white">
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center">
        <div className="absolute top-8 left-8">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-4">
              <span className="text-white font-semibold">i</span>
            </div>
            <h1 className="text-xl font-medium">i-numa</h1>
          </div>
        </div>
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">{title}<span className="text-blue-400">.</span></h1>
          <p className="text-gray-400">{description}</p>
        </div>
        
        {children}
        
        {footer && <div className="mt-6">{footer}</div>}
      </div>
      
      {showBackground && (
        <div className="hidden md:block w-1/2 relative">
          <div className="h-full w-full opacity-30 bg-cover bg-center absolute" 
               style={{backgroundImage: "url('/public/lovable-uploads/a5010d47-2fff-47c9-92a6-deba6b79fda5.png')"}} />
          <div className="absolute bottom-8 right-8">
            <div className="text-white font-bold text-4xl">
              .iN
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthLayout;
