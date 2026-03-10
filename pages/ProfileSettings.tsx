
import React, { useState, useEffect } from 'react';
import { AuthState, User, AppSettings, UserRole } from '../types';
import { User as UserIcon, Lock, Camera, Check, AlertCircle, Save, BookOpen, Trash2, Settings } from 'lucide-react';

interface ProfileSettingsProps {
  auth: AuthState;
  onUpdate: (updatedUser: User) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ auth, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: auth.user?.fullName || '',
    password: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('edulink_settings');
    return saved ? JSON.parse(saved) : { logoUrl: null, appName: 'EduLink Pro', loginBackgroundUrl: null };
  });
  const [appNameInput, setAppNameInput] = useState(settings.appName || 'EduLink Pro');
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMsg({ type: 'error', text: 'Konfirmasi password tidak cocok!' });
      return;
    }

    const savedUsersStr = localStorage.getItem('edulink_users');
    if (savedUsersStr && auth.user) {
      const users: User[] = JSON.parse(savedUsersStr);
      const updatedUser = { 
        ...auth.user, 
        fullName: formData.fullName,
        password: formData.password || auth.user.password
      };
      
      const updatedUsers = users.map(u => u.id === auth.user?.id ? updatedUser : u);
      localStorage.setItem('edulink_users', JSON.stringify(updatedUsers));
      onUpdate(updatedUser);
      setMsg({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSettings = { ...settings, logoUrl: reader.result as string };
        setSettings(newSettings);
        localStorage.setItem('edulink_settings', JSON.stringify(newSettings));
        setMsg({ type: 'success', text: 'Logo aplikasi diperbarui!' });
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    const newSettings = { ...settings, logoUrl: null };
    setSettings(newSettings);
    localStorage.setItem('edulink_settings', JSON.stringify(newSettings));
    window.dispatchEvent(new Event('storage'));
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newSettings = { ...settings, loginBackgroundUrl: reader.result as string };
        setSettings(newSettings);
        localStorage.setItem('edulink_settings', JSON.stringify(newSettings));
        setMsg({ type: 'success', text: 'Background login diperbarui!' });
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBg = () => {
    const newSettings = { ...settings, loginBackgroundUrl: null };
    setSettings(newSettings);
    localStorage.setItem('edulink_settings', JSON.stringify(newSettings));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAppNameSave = () => {
    const newSettings = { ...settings, appName: appNameInput };
    setSettings(newSettings);
    localStorage.setItem('edulink_settings', JSON.stringify(newSettings));
    setMsg({ type: 'success', text: 'Nama aplikasi diperbarui!' });
    // Force reload to update document title and layout immediately if needed, 
    // or rely on state if it's passed down. Since Layout reads from localStorage on mount,
    // we might need to dispatch an event or just let the user know it's saved.
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">Profil & Pengaturan</h2>
        <p className="text-slate-500 text-sm">Kelola informasi pribadi dan preferensi aplikasi</p>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in slide-in-from-top-2 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          {msg.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{msg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Profile Info */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="w-6 h-6 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Edit Profil Saya</h3>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Username (Tetap)</label>
              <input
                type="text"
                disabled
                value={auth.user?.username}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-100 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Ganti Password (Kosongkan jika tidak ganti)</label>
              <div className="space-y-3">
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Sandi baru"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Ulangi sandi baru"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Save className="w-5 h-5" />
              Simpan Perubahan Profil
            </button>
          </form>
        </div>

        {/* Application Logo Settings (Admin Only) */}
        <div className={`p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col ${auth.user?.role === UserRole.ADMIN ? 'bg-white' : 'bg-slate-50 opacity-60'}`}>
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Pengaturan Aplikasi</h3>
          </div>

          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Sesuaikan identitas aplikasi dengan mengubah nama dan mengunggah logo instansi Anda.
          </p>

          <div className="space-y-6 mb-6">
            {/* App Name Setting */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Aplikasi</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={appNameInput}
                  onChange={(e) => setAppNameInput(e.target.value)}
                  disabled={auth.user?.role !== UserRole.ADMIN}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                  placeholder="Masukkan nama aplikasi"
                />
                {auth.user?.role === UserRole.ADMIN && (
                  <button
                    onClick={handleAppNameSave}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Simpan
                  </button>
                )}
              </div>
            </div>

            {/* Logo Setting */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Logo Aplikasi</label>
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 mb-6">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-inner flex items-center justify-center mb-6 overflow-hidden border">
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt="App Logo" className="w-full h-full object-contain" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-slate-200" />
                  )}
                </div>
                
                {auth.user?.role === UserRole.ADMIN ? (
                  <div className="flex gap-3 w-full">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold hover:bg-slate-50 cursor-pointer transition-all">
                      <Camera className="w-4 h-4" />
                      Ganti Logo
                      <input type="file" className="sr-only" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                    {settings.logoUrl && (
                      <button 
                        onClick={removeLogo}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Hapus Logo"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">Hanya Admin</span>
                )}
              </div>
            </div>

            {/* Background Image Setting */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Background Login</label>
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-full h-32 bg-white rounded-2xl shadow-inner flex items-center justify-center mb-6 overflow-hidden border relative">
                  {settings.loginBackgroundUrl ? (
                    <img src={settings.loginBackgroundUrl} alt="Login Background" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center">
                      <Camera className="w-8 h-8 mb-2" />
                      <span className="text-xs font-medium">Default Background</span>
                    </div>
                  )}
                </div>
                
                {auth.user?.role === UserRole.ADMIN ? (
                  <div className="flex gap-3 w-full">
                    <label className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold hover:bg-slate-50 cursor-pointer transition-all">
                      <Camera className="w-4 h-4" />
                      Ganti Background
                      <input type="file" className="sr-only" accept="image/*" onChange={handleBgUpload} />
                    </label>
                    {settings.loginBackgroundUrl && (
                      <button 
                        onClick={removeBg}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Hapus Background"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">Hanya Admin</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
             <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Tips</span>
             </div>
             <p className="text-[11px] text-indigo-700/80 leading-relaxed font-medium">
               Gunakan gambar berformat PNG transparan atau SVG untuk hasil visual terbaik di berbagai latar belakang.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
