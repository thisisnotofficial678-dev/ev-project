import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/Auth/LoginPage';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { StationsPage } from './components/Stations/StationsPage';
import { BookingsPage } from './components/Bookings/BookingsPage';
import { AnalyticsPage } from './components/Analytics/AnalyticsPage';
import { LoadMonitoringPage } from './components/LoadMonitoring/LoadMonitoringPage';
import { NotificationsPage } from './components/Notifications/NotificationsPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Main Layout Component
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}

// App Routes Component
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/stations" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <StationsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bookings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <BookingsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <AnalyticsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/load-monitoring" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <LoadMonitoringPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotificationsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
