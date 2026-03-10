
import React, { useState, useEffect } from 'react';
import { Information, AuthState, UserRole } from '../types';
import { Plus, Trash2, Edit3, Bell, Search, X, Check, Calendar } from 'lucide-react';

interface InformationManagerProps {
  auth: AuthState;
}

const InformationManager: React.FC<InformationManagerProps> = ({ auth }) => {
  const [infoList, setInfoList] = useState<Information[]>(() => {
    const saved = localStorage.getItem('edulink_info');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<Information | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Pengumuman',
    active: true
  });

  const canEdit = auth.user?.role === UserRole.ADMIN || auth.user?.role === UserRole.STAFF;

  useEffect(() => {
    localStorage.setItem('edulink_info', JSON.stringify(infoList));
  }, [infoList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInfo) {
      setInfoList(infoList.map(i => i.id === editingInfo.id ? { ...i, ...formData } : i));
    } else {
      const newInfo: Information = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      };
      setInfoList([newInfo, ...infoList]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus informasi ini?')) {
      setInfoList(infoList.filter(i => i.id !== id));
    }
  };

  const openModal = (info?: Information) => {
    if (info) {
      setEditingInfo(info);
      setFormData({
        title: info.title,
        content: info.content,
        category: info.category,
        active: info.active
      });
    } else {
      setEditingInfo(null);
      setFormData({ title: '', content: '', category: 'Pengumuman', active: true });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingInfo(null);
  };

  const filteredInfo = infoList.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Informasi</h2>
          <p className="text-slate-500 text-sm">Kelola pengumuman dan berita untuk client</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
          >
            <Plus className="w-5 h-5" />
            Tambah Informasi
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Cari pengumuman..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredInfo.length > 0 ? filteredInfo.map((info) => (
          <div key={info.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${info.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                    {info.category}
                  </span>
                  {!info.active && <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">Draft</span>}
                  <div className="flex items-center text-[10px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3 mr-1" />
                    {info.date}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{info.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{info.content}</p>
              </div>
            </div>
            {canEdit && (
              <div className="flex items-center gap-2 self-end md:self-center">
                <button 
                  onClick={() => openModal(info)}
                  className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(info.id)}
                  className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-200" />
            </div>
            <p className="text-slate-500 font-medium">Belum ada informasi yang dipublikasikan</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">{editingInfo ? 'Edit Informasi' : 'Tambah Informasi Baru'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Informasi</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Contoh: Jadwal Ujian Tengah Semester"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                  >
                    <option>Pengumuman</option>
                    <option>Berita</option>
                    <option>Akademik</option>
                    <option>Event</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <div className="flex items-center mt-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, active: !formData.active})}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.active ? 'bg-indigo-600' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.active ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="ml-3 text-sm text-slate-600 font-medium">{formData.active ? 'Publikasikan' : 'Simpan sebagai Draft'}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Konten / Isi Informasi</label>
                <textarea
                  required
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                  placeholder="Tuliskan detail informasi di sini..."
                ></textarea>
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
                  {editingInfo ? 'Simpan Perubahan' : 'Buat Informasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationManager;
