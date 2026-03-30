import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { LoadingScreen } from "@/components/LoadingScreen";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Prevent redirect while Firebase auth state is initializing.
  if (isLoading) {
    return <LoadingScreen message="Checking your session..." fullScreen />;
  }

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
