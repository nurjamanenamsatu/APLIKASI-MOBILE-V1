
import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { BookOpen, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({ logoUrl: null, appName: 'EduLink Pro' });

  useEffect(() => {
    const savedSettings = localStorage.getItem('edulink_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithGoogle();
      // The auth state change listener in App.tsx will handle the redirect
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat login dengan Google.');
      setIsLoading(false);
    }
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
          <div className="space-y-6">
            
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Masuk dengan Google
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className={`text-center mt-8 text-[10px] font-bold tracking-widest ${settings.loginBackgroundUrl ? 'text-white/75' : 'text-slate-500/75'}`}>
          SUPPORT BY ENJE
        </div>
      </div>
    </div>
  );
};

export default Login;
