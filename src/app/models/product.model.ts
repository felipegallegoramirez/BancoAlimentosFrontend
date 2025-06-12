export interface Product {
  id_product?: string;
  name: string;
  entry_date: string;
  expiration_date: string; 
  received_by: string;
  headquarters: string;
  place_in_inventory: string;
  quantity: number;
  unit: number;
  lot: string;
  id_category: string;
  id_state_product: string;
  id_subcategory: string;
  id_provider: string;
  invoice_number: string;
  code: string;
  unit_weight: string;
  total_weight: string;
  created_at?: Date;
  updated_at?: Date;
}