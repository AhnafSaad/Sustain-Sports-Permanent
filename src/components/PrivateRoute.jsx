import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const PrivateRoute = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    
    toast({
      variant: "destructive",
      title: "Login Required",
      description: "You must be logged in to access this page.",
    });
    
  
    return <Navigate to="/login" replace />;
  }


  return <Outlet />;
};

export default PrivateRoute;