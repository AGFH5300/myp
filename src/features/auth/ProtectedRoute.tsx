import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!session) return <Navigate to="/auth" replace state={{ from: location }} />;

  return <Outlet />;
}

export function AdminRoute() {
  const { profile, loading } = useAuth();
  if (loading) return <div className="p-8">Loading...</div>;
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export function OnboardingGate() {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile?.onboarding_completed && !location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}
