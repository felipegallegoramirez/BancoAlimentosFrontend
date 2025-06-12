export interface User {
  id_user: string;
  name: string;
  lastname: string;
  num_doc: string;
  email: string;
  password?: string;
  id_role: string;
  id_type_doc:string;
  created_at: Date;
  updated_at: Date;
}