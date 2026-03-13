import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppShell from './components/layout/AppShell';
import AuthPage from './components/auth/AuthPage';
import { useSagaStore } from './store/store';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const loadAllData = useSagaStore((s) => s.loadAllData);
  const dataLoaded = useSagaStore((s) => s.dataLoaded);
  const clearData = useSagaStore((s) => s.clearData);

  useEffect(() => {
    if (user && !dataLoaded) {
      loadAllData(user.id);
    }
    if (!user) {
      clearData();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-saga-bg">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 size={24} className="animate-spin text-saga-crimson mb-3" />
          <p className="font-cinzel text-tiny tracking-[0.2em] text-saga-faint uppercase">
            Loading your saga...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-saga-bg">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 size={24} className="animate-spin text-saga-crimson mb-3" />
          <p className="font-cinzel text-tiny tracking-[0.2em] text-saga-faint uppercase">
            Gathering your chronicles...
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <AuthPage />;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthRoute />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
