
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
import { auth, db, logOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDocFromServer } from 'firebase/firestore';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDocFromServer(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            if (userData.active) {
              setAuthState({ user: userData, isAuthenticated: true });
            } else {
              setAuthState({ user: null, isAuthenticated: false });
              await logOut();
              alert("Akun Anda dinonaktifkan. Hubungi admin.");
            }
          } else {
            // If user doesn't exist in Firestore but is logged in via Google
            // We might need to handle bootstrapping the first admin here
            if (firebaseUser.email === "nurjaman612021@gmail.com") {
               const newAdmin: User = {
                 id: firebaseUser.uid,
                 uid: firebaseUser.uid,
                 username: firebaseUser.email.split('@')[0],
                 email: firebaseUser.email,
                 role: UserRole.ADMIN,
                 fullName: firebaseUser.displayName || 'Administrator',
                 active: true
               };
               setAuthState({ user: newAdmin, isAuthenticated: true });
            } else {
               setAuthState({ user: null, isAuthenticated: false });
               await logOut();
               alert("Akun belum terdaftar di sistem. Hubungi admin.");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setAuthState({ user: null, isAuthenticated: false });
        }
      } else {
        setAuthState({ user: null, isAuthenticated: false });
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logOut();
    setAuthState({ user: null, isAuthenticated: false });
  };

  const refreshAuth = (updatedUser: User) => {
    setAuthState(prev => ({ ...prev, user: updatedUser }));
  };

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center bg-indigo-50">Loading...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!authState.isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        
        <Route path="/" element={authState.isAuthenticated ? <Layout auth={authState} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route index element={
            authState.user?.role === UserRole.ADMIN || authState.user?.role === UserRole.TEACHER 
            ? <AdminDashboard auth={authState} /> 
            : <ClientDashboard auth={authState} />
          } />
          <Route path="links" element={<AppLinkManager auth={authState} />} />
          <Route path="users" element={<UserManager auth={authState} />} />
          <Route path="information" element={<InformationManager auth={authState} />} />
          <Route path="profile" element={<ProfileSettings auth={authState} onUpdate={refreshAuth} />} />
          <Route path="client" element={<ClientDashboard auth={authState} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
