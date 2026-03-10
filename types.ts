
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staf',
  VIEWER = 'viewer'
}

export interface User {
  id: string;
  username: string;
  password?: string;
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
    capabilities: ['Full access', 'User management', 'Link CRUD', 'View statistics', 'Information management', 'System settings']
  },
  {
    role: UserRole.STAFF,
    capabilities: ['Link CRUD', 'Information management', 'View statistics']
  },
  {
    role: UserRole.VIEWER,
    capabilities: ['View links', 'Read information', 'Personal portal access']
  }
];
