
import React, { useState, useEffect } from 'react';
import { User, UserRole, AppSettings } from '../types';
import { BookOpen, ShieldCheck, User as UserIcon, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({ logoUrl: null, appName: 'EduLink Pro' });

  useEffect(() => {
    const savedSettings = localStorage.getItem('edulink_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const savedUsersStr = localStorage.getItem('edulink_users');
      let users: User[] = [];
      
      if (savedUsersStr) {
        users = JSON.parse(savedUsersStr);
      }
      
      // Ensure at least one admin exists
      if (!users.some(u => u.role === UserRole.ADMIN)) {
        const defaultAdmin: User = { id: '1', username: 'admin', password: 'admin', fullName: 'Administrator', role: UserRole.ADMIN, active: true };
        users.push(defaultAdmin);
        localStorage.setItem('edulink_users', JSON.stringify(users));
      }

      let foundUser = users.find(u => u.username === username.trim() && u.password === password);

      // Fallback if admin password was forgotten
      if (!foundUser && username.trim() === 'admin' && password === 'admin') {
        foundUser = { id: '1', username: 'admin', password: 'admin', fullName: 'Administrator', role: UserRole.ADMIN, active: true };
        const existingAdminIndex = users.findIndex(u => u.username === 'admin');
        if (existingAdminIndex >= 0) {
          users[existingAdminIndex].password = 'admin';
        } else {
          users.push(foundUser);
        }
        localStorage.setItem('edulink_users', JSON.stringify(users));
      }

      if (foundUser) {
        if (!foundUser.active) {
          setError('Akun Anda dinonaktifkan. Hubungi admin.');
        } else {
          onLogin(foundUser);
        }
      } else {
        setError('Username atau password salah.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 bg-indigo-50 relative"
      style={settings.loginBackgroundUrl ? {
        backgroundImage: `url(${settings.loginBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      {settings.loginBackgroundUrl && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>
      )}
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-lg mb-4 min-w-[80px] min-h-[80px]">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="App Logo" className="w-16 h-16 object-contain" />
            ) : (
              <BookOpen className="text-indigo-600 w-10 h-10" />
            )}
          </div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${settings.loginBackgroundUrl ? 'text-white' : 'text-slate-900'}`}>
            {settings.appName.split(' ')[0]} <span className={settings.loginBackgroundUrl ? 'text-indigo-300' : 'text-indigo-600'}>{settings.appName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className={`mt-2 font-medium ${settings.loginBackgroundUrl ? 'text-slate-200' : 'text-slate-600'}`}>Layanan Tautan Edukasi Terpadu</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-100/50 p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-indigo-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>
        </div>
        
        <div className={`text-center mt-8 text-[10px] font-bold tracking-widest ${settings.loginBackgroundUrl ? 'text-white/75' : 'text-slate-500/75'}`}>
          SUPPORT BY ENJE
        </div>
      </div>
    </div>
  );
};

export default Login;
