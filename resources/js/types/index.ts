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
  roles?: Role[];
  permissions?: string[];
  [key: string]: unknown; // This allows for additional properties...
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: string[];
}

export interface Site {
  id: number;
  name: string;
  url: string;
  description: string | null;
  type: 'WordPress' | 'Drupal' | 'SPIP' | 'Typo3' | 'laravel' | 'symfony' | 'other';
  team: 'quai13' | 'vernalis';
  user_id: number;
  user?: User;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  [key: string]: unknown;
}
