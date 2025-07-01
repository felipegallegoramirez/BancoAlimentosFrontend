export interface Beneficiary {
    id_beneficiary?: string;
    legal_name: string;
    trade_name: string | null;
    num_doc: string;
    id_type_doc: string;
    legal_representative: string;
    address: string;
    created_at: Date;
    updated_at: Date;
  }