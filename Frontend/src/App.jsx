import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import QueryDetail from './pages/QueryDetail';
import NewQuery from './pages/NewQuery';
import Home from "./pages/Home.jsx";

import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ModalWrapper from './components/ModalWrapper';

// Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Public Only Route
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

// Layout
const DashboardLayout = ({ children, onLoginClick }) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <Navbar
        onLoginClick={onLoginClick}
        onMenuClick={() => setOpenMenu(true)}
      />

      {/* Right-side dynamic sidebar */}
      <Sidebar open={openMenu} onClose={() => setOpenMenu(false)} />

      {/* Main content (full width, no left sidebar) */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};




export default function App() {
  const { user, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);


  return (
    <>
      {/* ROUTES */}
      <Routes>

        {/* PUBLIC HOME PAGE */}
        <Route
          path="/"
          element={
            loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : user ? (
              <Navigate to="/inbox" replace />
            ) : (
              <Home
                onLoginClick={() => setShowLoginModal(true)}
                onSignupClick={() => setShowSignupModal(true)}


              />
            )
          }
        />

        {/* LOGIN PAGE (if someone opens /login manually) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        {/* SIGNUP PAGE */}
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Signup />
            </PublicOnlyRoute>
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout onLoginClick={() => setShowLoginModal(true)}>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* INBOX */}
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <DashboardLayout onLoginClick={() => setShowLoginModal(true)}>
                <Inbox />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* NEW QUERY */}
        <Route
          path="/queries/new"
          element={
            <ProtectedRoute>
              <DashboardLayout onLoginClick={() => setShowLoginModal(true)}>
                <NewQuery />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* QUERY DETAIL */}
        <Route
          path="/queries/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout onLoginClick={() => setShowLoginModal(true)}>
                <QueryDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div className="p-8">Page not found</div>} />
      </Routes>

      {/* SIGNUP MODAL */}
      <ModalWrapper
        open={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      >
        <Signup
          onClose={() => setShowSignupModal(false)}
          onSwitchToLogin={() => {
            setShowSignupModal(false);
            setShowLoginModal(true);
          }}
        />
      </ModalWrapper>


      {/* LOGIN MODAL (WORKS GLOBALLY) */}
      <ModalWrapper open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Login onClose={() => setShowLoginModal(false)} />
      </ModalWrapper>
    </>
  );
}
