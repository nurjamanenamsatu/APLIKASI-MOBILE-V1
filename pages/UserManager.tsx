
import React, { useState, useEffect } from 'react';
import { User, UserRole, AuthState, ROLE_PERMISSIONS } from '../types';
import { 
  Plus, 
  Trash2, 
  Shield, 
  User as UserIcon, 
  X, 
  Check, 
  Search, 
  Edit3, 
  Lock, 
  ShieldCheck,
  Info
} from 'lucide-react';

interface UserManagerProps {
  auth: AuthState;
}

const UserManager: React.FC<UserManagerProps> = ({ auth }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('edulink_users');
    const initialUsers: User[] = [
      { id: '1', username: 'admin', password: 'admin', fullName: 'Administrator', role: UserRole.ADMIN, active: true },
      { id: '2', username: 'guru01', password: 'guru', fullName: 'Guru Akademik', role: UserRole.TEACHER, active: true },
      { id: '3', username: 'siswa01', password: 'siswa', fullName: 'Siswa', role: UserRole.STUDENT, active: true },
    ];
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: UserRole.STUDENT
  });

  useEffect(() => {
    localStorage.setItem('edulink_users', JSON.stringify(users));
  }, [users]);

  if (auth.user?.role !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border">
        <Shield className="w-16 h-16 text-rose-500 mb-4 opacity-20" />
        <h3 className="text-xl font-bold text-slate-800">Akses Terbatas</h3>
        <p className="text-slate-500">Hanya Administrator yang dapat mengelola pengguna.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { 
        ...u, 
        username: formData.username,
        fullName: formData.fullName,
        role: formData.role,
        // Update password only if provided
        password: formData.password || u.password 
      } : u));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        password: formData.password || 'password123',
        fullName: formData.fullName,
        role: formData.role,
        active: true
      };
      setUsers([...users, newUser]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (id === auth.user?.id) {
      alert('Tidak bisa menghapus akun Anda sendiri');
      return;
    }
    if (window.confirm('Hapus pengguna ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    if (id === auth.user?.id) return;
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: '', // Leave empty to indicate no change unless typed
        fullName: user.fullName,
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({ username: '', password: '', fullName: '', role: UserRole.STUDENT });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN: return <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Administrator</span>;
      case UserRole.TEACHER: return <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Guru</span>;
      default: return <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Siswa</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h2>
          <p className="text-slate-500 text-sm">Konfigurasi akun dan otoritas sistem</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          <Plus className="w-5 h-5" />
          Tambah Pengguna
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">Identitas</th>
                    <th className="px-6 py-4">Peran</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                            <p className="text-xs text-slate-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleStatus(user.id)}
                          disabled={user.id === auth.user?.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                            user.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          } ${user.id === auth.user?.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                          {user.active ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openModal(user)}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            disabled={user.id === auth.user?.id}
                            className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Permissions Panel */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Hak Akses Peran</h3>
            </div>
            
            <div className="space-y-6">
              {ROLE_PERMISSIONS.map((perm) => (
                <div key={perm.role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{perm.role}</span>
                    {getRoleBadge(perm.role)}
                  </div>
                  <ul className="space-y-1.5">
                    {perm.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <Check className="w-3 h-3 text-emerald-500" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
              <Info className="w-5 h-5 text-indigo-500 shrink-0" />
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Perubahan pada hak akses peran memerlukan penyesuaian pada level kode sumber untuk memastikan keamanan data tetap terjaga.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">{editingUser ? 'Edit Profil Pengguna' : 'Tambah Pengguna Baru'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="budi_s"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    {editingUser ? 'Sandi Baru' : 'Kata Sandi'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required={!editingUser}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder={editingUser ? 'Tetap sama' : '••••••••'}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Peran / Akses</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value={UserRole.ADMIN}>Administrator (Akses Penuh)</option>
                  <option value={UserRole.TEACHER}>Guru (Manajemen Link & Info)</option>
                  <option value={UserRole.STUDENT}>Siswa (Hanya Lihat)</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-colors"
                >
                  {editingUser ? 'Perbarui Akun' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
