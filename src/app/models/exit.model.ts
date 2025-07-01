export interface Exit {
  id_output?: string; // UUID generado automáticamente, puede no enviarse al crear
  id_product?: string | null;
  amount_product: number;
  id_beneficiary: string;
  id_user: string;
  created_at?: Date;
  updated_at?: Date;
}