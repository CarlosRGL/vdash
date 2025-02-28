import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

export interface Site {
  id: number;
  name: string;
  url: string;
  description: string | null;
  type: 'wordpress' | 'laravel' | 'other';
  status: 'active' | 'inactive' | 'maintenance';
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  [key: string]: unknown;
}
