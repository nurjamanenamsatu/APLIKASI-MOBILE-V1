
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

export interface User {
  id: string;
  uid?: string;
  username: string;
  password?: string;
  email?: string;
  role: UserRole;
  fullName: string;
  active: boolean;
}

export interface AppLink {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  category: string;
  clicks: number;
}

export interface Information {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  active: boolean;
}

export interface AppSettings {
  logoUrl: string | null;
  appName: string;
  loginBackgroundUrl?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface RolePermission {
  role: UserRole;
  capabilities: string[];
}

export const ROLE_PERMISSIONS: RolePermission[] = [
  {
    role: UserRole.ADMIN,
    capabilities: ['Akses Penuh', 'Manajemen Pengguna', 'Manajemen Tautan', 'Lihat Statistik', 'Manajemen Informasi', 'Pengaturan Sistem']
  },
  {
    role: UserRole.TEACHER,
    capabilities: ['Manajemen Tautan', 'Manajemen Informasi', 'Lihat Statistik']
  },
  {
    role: UserRole.STUDENT,
    capabilities: ['Lihat Tautan', 'Baca Informasi', 'Akses Portal Personal']
  }
];
