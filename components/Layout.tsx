
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Users, 
  LogOut, 
  Menu,
  X,
  ExternalLink,
  BookOpen,
  ChevronRight,
  Bell,
  Settings,
  User as UserIcon
} from 'lucide-react';
import { AuthState, UserRole, AppSettings } from '../types';

interface LayoutProps {
  auth: AuthState;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ auth, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('edulink_settings');
    return saved ? JSON.parse(saved) : { logoUrl: null, appName: 'EduLink Pro' };
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('edulink_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    document.title = settings.appName || 'EduLink Pro';
  }, [settings.appName]);

  const isAdminOrTeacher = auth.user?.role === UserRole.ADMIN || auth.user?.role === UserRole.TEACHER;
  const isAdmin = auth.user?.role === UserRole.ADMIN;

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      show: isAdminOrTeacher
    },
    {
      title: 'Manajemen Tautan',
      path: '/links',
      icon: LinkIcon,
      show: isAdminOrTeacher
    },
    {
      title: 'Manajemen Informasi',
      path: '/information',
      icon: Bell,
      show: isAdminOrTeacher
    },
    {
      title: 'Manajemen Pengguna',
      path: '/users',
      icon: Users,
      show: isAdmin
    },
    {
      title: 'Portal Client',
      path: '/client',
      icon: ExternalLink,
      show: true
    },
    {
      title: 'Profil & Pengaturan',
      path: '/profile',
      icon: Settings,
      show: true
    }
  ];

  const NavLink = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
            : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
        }`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-indigo-600'}`} />
        <span className="font-medium text-sm">{item.title}</span>
        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
      </Link>
    );
  };

  const isStudent = auth.user?.role === UserRole.STUDENT;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      {!isStudent && (
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r sticky top-0 h-screen p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
            ) : (
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-inner">
                <BookOpen className="text-white w-6 h-6" />
              </div>
            )}
            <h1 className="font-extrabold text-xl text-slate-800 tracking-tight">
              {settings.appName}
            </h1>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto pr-2">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Utama</p>
            {menuItems.filter(i => i.show).map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t">
            <Link to="/profile" className="block group">
              <div className="bg-slate-50 group-hover:bg-indigo-50 rounded-2xl p-4 mb-4 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs border-2 border-white shadow-sm">
                    {auth.user?.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{auth.user?.fullName}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{auth.user?.role}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </aside>
      )}

      {/* Mobile Sidebar overlay and mobile drawer code remains similar but using new menuItems */}
      {isSidebarOpen && !isStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      {!isStudent && (
        <aside className={`fixed top-0 left-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden p-6 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
              ) : (
                <div className="bg-indigo-600 p-2 rounded-xl"><BookOpen className="text-white w-5 h-5" /></div>
              )}
              <h1 className="font-extrabold text-xl text-slate-800 tracking-tight">{settings.appName}</h1>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400"><X className="w-6 h-6" /></button>
          </div>
          <nav className="space-y-2">{menuItems.filter(i => i.show).map((item) => (<NavLink key={item.path} item={item} />))}</nav>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white border-b px-4 lg:px-8 py-4 flex items-center justify-between z-30 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            {!isStudent && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-500 lg:hidden bg-slate-50 rounded-lg"><Menu className="w-6 h-6" /></button>
            )}
            <h2 className="font-bold text-slate-800 text-lg hidden lg:block">
              {menuItems.find(m => m.path === location.pathname)?.title || 'SMAN 117'}
            </h2>
            <div className={`flex items-center gap-2 ${isStudent ? '' : 'lg:hidden'}`}>
               {settings.logoUrl ? (
                 <img src={settings.logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
               ) : (
                 <BookOpen className="text-indigo-600 w-5 h-5" />
               )}
               <span className="font-bold text-slate-800">sman117jkt</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/profile" className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800">{auth.user?.fullName}</p>
                <p className="text-[10px] text-slate-500 capitalize">{auth.user?.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100">
                {auth.user?.fullName.charAt(0)}
              </div>
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              title="Keluar Aplikasi"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8 bg-slate-50 scroll-smooth">
          <div className="max-w-6xl mx-auto"><Outlet /></div>
        </main>

        {/* Footer Banner */}
        <div className="bg-transparent text-slate-500 px-4 py-4 text-center text-[10px] font-bold tracking-widest z-40 relative shrink-0">
          <span className="relative z-10 flex items-center justify-center gap-2 opacity-75">
            SUPPORT BY ENJE
          </span>
        </div>
      </div>
    </div>
  );
};

export default Layout;
