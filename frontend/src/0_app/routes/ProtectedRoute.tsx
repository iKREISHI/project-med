// @ts-nocheck
// @ts-nocheck
import { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  role: string; 
  allowedRoles: string[]; 
  children: ReactNode; 
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  role,
  allowedRoles,
  children,
}) => {
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Если роль разрешена
  return <>{children}</>;
};