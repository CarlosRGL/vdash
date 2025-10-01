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
  credential?: SiteCredential;
  contract?: SiteContract;
  server_info?: SiteServerInfo;
  php_version?: string | null;
  last_sync?: string | null;
  sync_enabled: boolean;
  api_token: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  wordpress_version?: string | null;
  [key: string]: unknown;
}

export interface SiteContract {
  id: number;
  site_id: number;
  contract_start_date: string | null;
  contract_end_date: string | null;
  contract_capacity: string | null;
  contract_storage_usage: string | null;
  contract_storage_limit: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteCredential {
  id: number;
  site_id: number;
  ftp_host: string | null;
  ftp_username: string | null;
  ftp_password: string | null;
  db_host: string | null;
  db_name: string | null;
  db_username: string | null;
  db_password: string | null;
  login_url: string | null;
  login_username: string | null;
  login_password: string | null;
  api_keys: string | null;
}

export interface SiteServerInfo {
  id: number;
  site_id: number;
  php_version: string | null;
  php_memory_limit: string | null;
  php_max_execution_time: number | null;
  php_post_max_size: string | null;
  php_upload_max_filesize: string | null;
  mysql_version: string | null;
  mysql_server_info: string | null;
  server_ip: string | null;
  server_hostname: string | null;
  created_at: string;
  updated_at: string;
}

interface LaravelPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface LaravelPaginationData {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: LaravelPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
