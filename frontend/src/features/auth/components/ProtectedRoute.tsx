import { Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { isPending, isAuthenticated } = useAuth();

  if (isPending) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
