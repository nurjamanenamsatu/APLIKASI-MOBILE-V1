
import React, { useState, useEffect } from 'react';
import { AppLink, Information, AuthState } from '../types';
import { ExternalLink, Search, Grid, List as ListIcon, BookOpen, Bell, ChevronRight, Calendar, Info } from 'lucide-react';

interface ClientDashboardProps {
  auth?: AuthState;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ auth }) => {
  const [links] = useState<AppLink[]>(() => {
    const saved = localStorage.getItem('edulink_links');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [infoList] = useState<Information[]>(() => {
    const saved = localStorage.getItem('edulink_info');
    const initial: Information[] = saved ? JSON.parse(saved) : [];
    return initial.filter(i => i.active);
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredLinks = links.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200/50 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 mb-5 backdrop-blur-sm">
            <BookOpen className="w-4 h-4 text-indigo-200" />
            <span className="text-indigo-50 tracking-wide">PORTAL EDUKASI</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Selamat Datang, {auth?.user?.fullName || 'Pengguna'}!</h2>
          <p className="text-indigo-100 max-w-md text-sm leading-relaxed">Temukan semua tautan aplikasi dan sumber daya pembelajaran Anda dalam satu tempat yang nyaman.</p>
        </div>
      </div>

      {/* Information Section */}
      {infoList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">Berita & Pengumuman</h3>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {infoList.map(info => (
              <div key={info.id} className="min-w-[300px] md:min-w-[350px] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md">
                    {info.category}
                  </span>
                  <div className="flex items-center text-[10px] text-slate-400 font-medium">
                    <Calendar className="w-3 h-3 mr-1" />
                    {info.date}
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 line-clamp-1">{info.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{info.content}</p>
                <button className="text-[11px] font-bold text-indigo-600 flex items-center mt-2 group">
                  Baca Selengkapnya
                  <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Daftar Aplikasi</h3>
          </div>
          <div className="flex p-1 bg-white border rounded-2xl shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari sumber daya atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredLinks.length > 0 ? filteredLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center bg-white p-6 rounded-3xl border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 shadow-inner bg-slate-50 border border-slate-100">
                  {link.imageUrl ? (
                    <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-400">
                      <BookOpen className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{link.title}</h3>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                  {link.category}
                </span>
              </a>
            )) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed">
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-bold">Tidak ada hasil ditemukan</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-50 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                  {link.imageUrl ? (
                    <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-base">{link.title}</h3>
                  <p className="text-slate-400 text-xs truncate">{link.category}</p>
                </div>
                <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
