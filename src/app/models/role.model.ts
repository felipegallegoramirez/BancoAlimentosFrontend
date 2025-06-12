import { Permission } from './permission.model';

export interface Role {
  id_role: string;
  name: string;
  permissions?: Permission[];
  created_at: Date;
  updated_at: Date;
}