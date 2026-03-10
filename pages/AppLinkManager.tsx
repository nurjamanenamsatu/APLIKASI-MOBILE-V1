
import React, { useState, useEffect } from 'react';
import { AppLink, AuthState, UserRole } from '../types';
import { Plus, Trash2, Edit3, Image as ImageIcon, Search, ExternalLink, X, Camera, QrCode, Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface AppLinkManagerProps {
  auth: AuthState;
}

const AppLinkManager: React.FC<AppLinkManagerProps> = ({ auth }) => {
  const [links, setLinks] = useState<AppLink[]>(() => {
    const saved = localStorage.getItem('edulink_links');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLink, setEditingLink] = useState<AppLink | null>(null);
  const [qrModalLink, setQrModalLink] = useState<AppLink | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: '',
    imageUrl: ''
  });

  const canEdit = auth.user?.role === UserRole.ADMIN || auth.user?.role === UserRole.STAFF;

  useEffect(() => {
    localStorage.setItem('edulink_links', JSON.stringify(links));
  }, [links]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLink) {
      setLinks(links.map(l => l.id === editingLink.id ? { ...l, ...formData } : l));
    } else {
      const newLink: AppLink = {
        id: Date.now().toString(),
        ...formData,
        clicks: 0
      };
      setLinks([...links, newLink]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Hapus tautan ini?')) {
      setLinks(links.filter(l => l.id !== id));
    }
  };

  const openModal = (link?: AppLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        url: link.url,
        category: link.category,
        imageUrl: link.imageUrl
      });
    } else {
      setEditingLink(null);
      setFormData({ title: '', url: '', category: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const closeQrModal = () => {
    setQrModalLink(null);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${qrModalLink?.title || 'qrcode'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const filteredLinks = links.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manajemen Tautan</h2>
          <p className="text-slate-500 text-sm">Kelola daftar aplikasi dan sumber daya edukasi</p>
        </div>
        {canEdit && (
          <button 
            onClick={() => openModal()}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
          >
            <Plus className="w-5 h-5" />
            Tambah Tautan
          </button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Cari tautan atau kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredLinks.length > 0 ? filteredLinks.map((link) => (
          <div key={link.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
              {link.imageUrl ? (
                <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-12 h-12 opacity-20" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  {link.category}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-slate-800 text-lg mb-1">{link.title}</h3>
              <p className="text-slate-500 text-xs mb-4 truncate">{link.url}</p>
              
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Buka Tautan"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => setQrModalLink(link)}
                    className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    title="Tampilkan QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openModal(link)}
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(link.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <ImageIcon className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Belum ada tautan yang ditambahkan</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">{editingLink ? 'Edit Tautan' : 'Tambah Tautan Baru'}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Judul Tautan</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Contoh: LMS Sekolah"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">URL / Link</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://google.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Pendidikan, Ujian, dll"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Thumbnail Gambar</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-xl hover:border-indigo-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {formData.imageUrl ? (
                      <div className="relative inline-block">
                        <img src={formData.imageUrl} className="h-32 w-48 object-cover rounded-lg shadow-sm" alt="Preview" />
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, imageUrl: ''})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-12 w-12 text-slate-300" />
                        <div className="flex flex-col items-center gap-2 text-sm text-slate-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            <span>Ambil Foto</span>
                            <input type="file" className="sr-only" accept="image/*" capture="environment" onChange={handleImageUpload} />
                          </label>
                          <span className="text-slate-400">atau</span>
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            <span>Upload file gambar</span>
                            <input type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                          </label>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                      </>
                    )}
                  </div>
                </div>
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
                  {editingLink ? 'Simpan Perubahan' : 'Tambah Tautan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* QR Code Modal */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeQrModal}></div>
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">QR Code Tautan</h3>
              <button onClick={closeQrModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-8 flex flex-col items-center justify-center space-y-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <QRCodeCanvas 
                  id="qr-code-canvas"
                  value={qrModalLink.url} 
                  size={200} 
                  level={"H"}
                  includeMargin={true}
                />
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-bold text-slate-800">{qrModalLink.title}</h4>
                <p className="text-xs text-slate-500 truncate max-w-[250px]">{qrModalLink.url}</p>
              </div>
              <button
                onClick={downloadQRCode}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLinkManager;
