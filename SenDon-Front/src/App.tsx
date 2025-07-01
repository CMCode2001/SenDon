import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Centres from './pages/Centres';
import DashboardDonneur from './pages/Donneur/DashboardDonneur';
import DashboardHopital from './pages/Hopital/DashboardHopital';

// 🔒 Route protégée
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// 🧱 Layout global avec Header et Footer
function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!user && <Footer />}
    </div>
  );
}

// 📍 Redirection automatique vers bon dashboard
function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/connexion" replace />;

  switch (user.role) {
    case 'USER':
      return <Navigate to="/donneur" replace />;
    case 'HOSPITAL':
      return <Navigate to="/hopital" replace />;
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

// 🌐 Routes de l'application
function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* 🌍 Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/centres" element={<Centres />} />

          {/* 🔐 Privé : USER */}
          <Route
            path="/donneur"
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardDonneur />
              </ProtectedRoute>
            }
          />

          {/* 🔐 Privé : HOSPITAL */}
          <Route
            path="/hopital"
            element={
              <ProtectedRoute allowedRoles={['HOSPITAL']}>
                <DashboardHopital />
              </ProtectedRoute>
            }
          />

          {/* 🔐 Privé : ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                      Dashboard Super Admin
                    </h1>
                    <p className="text-gray-600">Interface en cours de développement</p>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          {/* 🧭 Redirection dynamique après connexion */}
          <Route path="/dashboard" element={<DashboardRouter />} />

          {/* 🧱 Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// 🔁 Fournisseur global d'authentification
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
