
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Link as LinkIcon, Eye, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react';
import { AuthState } from '../types';

interface AdminDashboardProps {
  auth?: AuthState;
}

const data = [
  { name: 'Sen', clicks: 400, views: 2400 },
  { name: 'Sel', clicks: 300, views: 1398 },
  { name: 'Rab', clicks: 200, views: 9800 },
  { name: 'Kam', clicks: 278, views: 3908 },
  { name: 'Jum', clicks: 189, views: 4800 },
  { name: 'Sab', clicks: 239, views: 3800 },
  { name: 'Min', clicks: 349, views: 4300 },
];

const COLORS = ['#4f46e5', '#818cf8', '#6366f1', '#4338ca'];

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3.5 rounded-2xl ${color} text-white shadow-sm`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="flex items-center gap-2 mt-5">
      {trend > 0 ? (
        <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-md">
          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +{trend}%
        </span>
      ) : (
        <span className="flex items-center text-rose-600 text-xs font-bold bg-rose-50 px-2 py-1 rounded-md">
          <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> {trend}%
        </span>
      )}
      <span className="text-slate-400 text-[11px] font-medium">vs bulan lalu</span>
    </div>
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ auth }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-3xl p-8 text-white shadow-lg shadow-indigo-200/50 relative overflow-hidden mb-8">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 mb-5 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-indigo-200" />
            <span className="text-indigo-50 tracking-wide">ADMINISTRATOR PORTAL</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-3 tracking-tight">Selamat Datang, {auth?.user?.fullName || 'Admin'}!</h2>
          <p className="text-indigo-100 max-w-md text-sm leading-relaxed">Pantau aktivitas platform Anda secara real-time dan kelola sistem dengan mudah melalui dashboard terpusat ini.</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">Ringkasan Statistik</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tautan" value="48" icon={LinkIcon} trend={12} color="bg-indigo-600" />
        <StatCard title="Klik Tautan" value="2.4k" icon={TrendingUp} trend={8} color="bg-emerald-500" />
        <StatCard title="Pengguna Aktif" value="156" icon={Users} trend={-3} color="bg-orange-500" />
        <StatCard title="Tampilan Profil" value="12.8k" icon={Eye} trend={24} color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Aktivitas Klik Mingguan</h3>
            <select className="text-xs border rounded-md p-1 outline-none text-slate-600">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Distribusi Kategori</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-bold text-slate-800">Tautan Terpopuler</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Tautan</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Klik</th>
                <th className="px-6 py-4">Konversi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Modul Matematika SD', cat: 'Pendidikan', clicks: '1,240', conv: '85%' },
                { name: 'Latihan Soal CPNS', cat: 'Ujian', clicks: '982', conv: '72%' },
                { name: 'Beasiswa Luar Negeri', cat: 'Informasi', clicks: '844', conv: '64%' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">{row.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full text-xs font-medium">
                      {row.cat}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.clicks}</td>
                  <td className="px-6 py-4 text-sm text-emerald-600 font-medium">{row.conv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
