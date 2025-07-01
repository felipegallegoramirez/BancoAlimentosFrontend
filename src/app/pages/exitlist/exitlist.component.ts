import { Component, OnInit } from '@angular/core';
import { ExitService } from '../../services/exit.service';
import { ProductService } from '../../services/product.service';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { Exit } from '../../models/exit.model';
import { Product } from '../../models/product.model';
import { Beneficiary } from '../../models/beneficiary.model';

@Component({
  selector: 'app-exitlist',
  templateUrl: './exitlist.component.html',
  styleUrl: './exitlist.component.css'
})
export class ExitlistComponent implements OnInit {
  exits: Exit[] = [];
  products: Product[] = [];
  beneficiaries: Beneficiary[] = [];
  loading = true;
  error = '';

  constructor(
    private exitService: ExitService,
    private productService: ProductService,
    private beneficiaryService: BeneficiaryService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    try {
      this.loading = true;
      
      // Cargar exits, productos y beneficiarios en paralelo
      const [exitsData, productsData, beneficiariesData] = await Promise.all([
        this.exitService.getExits(),
        this.productService.getProducts(),
        this.beneficiaryService.getBeneficiarys()
      ]);

      if (exitsData) {
        this.exits = exitsData;
      }
      
      if (productsData) {
        this.products = productsData;
      }
      
      if (beneficiariesData) {
        this.beneficiaries = beneficiariesData;
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      this.error = 'Error al cargar los datos';
    } finally {
      this.loading = false;
    }
  }

  getProductName(productId: string | null | undefined): string {
    if (!productId) return 'N/A';
    const product = this.products.find(p => p.id_product === productId);
    return product ? product.name : 'Producto no encontrado';
  }

  getBeneficiaryName(beneficiaryId: string): string {
    const beneficiary = this.beneficiaries.find(b => b.id_beneficiary === beneficiaryId);
    return beneficiary ? beneficiary.legal_name : 'Beneficiario no encontrado';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async deleteExit(exitId: string | undefined) {
    if (!exitId) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar este exit?')) {
      try {
        await this.exitService.deleteExit(exitId);
        await this.loadData(); // Recargar datos
      } catch (error) {
        console.error('Error eliminando exit:', error);
        alert('Error al eliminar el exit');
      }
    }
  }
}
