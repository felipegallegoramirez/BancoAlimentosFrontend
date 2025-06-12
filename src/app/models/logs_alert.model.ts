export interface LogsAlert {
    id_log: string;
    id_subcategory?: string;
    subcategory_name?: string;
    min_items?: number;
    total_quantity?: number;
    id_product?: string;
    subcategory?: string;
    product?: string;
    alert_date?: Date;
    alert_type?: string;
  }