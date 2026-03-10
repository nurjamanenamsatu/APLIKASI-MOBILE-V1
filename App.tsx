
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AppLinkManager from './pages/AppLinkManager';
import UserManager from './pages/UserManager';
import ClientDashboard from './pages/ClientDashboard';
import InformationManager from './pages/InformationManager';
import ProfileSettings from './pages/ProfileSettings';
import Layout from './components/Layout';
import { User, UserRole, AuthState } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('edulink_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem('edulink_auth', JSON.stringify(auth));
  }, [auth]);

  const login = (user: User) => {
    setAuth({ user, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ user: null, isAuthenticated: false });
  };

  const refreshAuth = (updatedUser: User) => {
    setAuth(prev => ({ ...prev, user: updatedUser }));
  };

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!auth.isAuthenticated ? <Login onLogin={login} /> : <Navigate to="/" />} 
        />
        
        <Route path="/" element={auth.isAuthenticated ? <Layout auth={auth} onLogout={logout} /> : <Navigate to="/login" />}>
          <Route index element={
            auth.user?.role === UserRole.ADMIN || auth.user?.role === UserRole.STAFF 
            ? <AdminDashboard auth={auth} /> 
            : <ClientDashboard auth={auth} />
          } />
          <Route path="links" element={<AppLinkManager auth={auth} />} />
          <Route path="users" element={<UserManager auth={auth} />} />
          <Route path="information" element={<InformationManager auth={auth} />} />
          <Route path="profile" element={<ProfileSettings auth={auth} onUpdate={refreshAuth} />} />
          <Route path="client" element={<ClientDashboard auth={auth} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
