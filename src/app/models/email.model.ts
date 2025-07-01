
export interface Email {
  id_email?: string;           // UUID generado automáticamente
  name_owner: string;          // Nombre del propietario del correo
  email: string;               // Dirección de correo electrónico
  created_at?: Date;           // Fecha de creación, generada automáticamente
  updated_at?: Date;           // Fecha de actualización, generada automáticamente
}
