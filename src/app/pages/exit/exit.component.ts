// src/app/exit/exit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Provider } from '../../models/provider.model';
import { Subcategory } from '../../models/subcategory.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProviderService } from '../../services/provider.service';
import { SubcategoryService } from '../../services/subcategory.service';

declare var $: any; // Declare $ for Materialize CSS
declare var M: any; // Declare M for Materialize global object

@Component({
  selector: 'app-exit',
  templateUrl: './exit.component.html',
  styleUrls: ['./exit.component.css']
})
export class ExitComponent implements OnInit {
  searchForm: FormGroup;
  exitForm: FormGroup;
  foundProduct: Product | null = null;
  categories: Category[] = [];
  providers: Provider[] = [];
  subcategories: Subcategory[] = [];
  products: Product[] = []; // To hold all products for search filtering

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private subcategoryService: SubcategoryService
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['', Validators.required]
    });

    this.exitForm = this.fb.group({
      quantityToExit: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadAllProducts(); // Load all products for client-side search
    this.loadCategories();
    this.loadProviders();
    this.loadSubcategories();

    $(document).ready(() => {
      $('select').formSelect();
      M.updateTextFields();
    });
  }

  loadAllProducts(): void {
    this.productService.getProducts().then(
      (data: any) => {
        this.products = data;
      },
      (error) => {
        console.error('Error loading all products for search:', error);
        M.toast({ html: 'Error al cargar productos para la búsqueda.' });
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategorys().then(
      (data: any) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadProviders(): void {
    this.providerService.getProviders().then(
      (data: any) => {
        this.providers = data;
      },
      (error) => {
        console.error('Error loading providers:', error);
      }
    );
  }

  loadSubcategories(): void {
    this.subcategoryService.getSubcategorys().then(
      (data: any) => {
        this.subcategories = data;
      },
      (error) => {
        console.error('Error loading subcategories:', error);
      }
    );
  }

  searchProduct(): void {
    if (this.searchForm.invalid) {
      M.toast({ html: 'Por favor, ingrese un valor de búsqueda.' });
      return;
    }

    const query = this.searchForm.controls['searchQuery'].value.toLowerCase();
    // Search by code, name, or invoice number (as an example)
    const product = this.products.find(p =>
      p.code.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.invoice_number.toLowerCase().includes(query)
    );

    if (product) {
      this.foundProduct = product;
      this.exitForm.reset(); // Reset exit quantity
      this.exitForm.controls['quantityToExit'].setValue(1); // Default to 1
      M.toast({ html: `Producto "${product.name}" encontrado.` });
    } else {
      this.foundProduct = null;
      M.toast({ html: 'Producto no encontrado.' });
    }
  }

  exitProduct(): void {
    if (!this.foundProduct) {
      M.toast({ html: 'Primero debe buscar y seleccionar un producto.' });
      return;
    }

    if (this.exitForm.invalid) {
      M.toast({ html: 'Por favor, ingrese una cantidad válida para la salida.' });
      return;
    }

    const quantityToExit = this.exitForm.controls['quantityToExit'].value;

    if (quantityToExit > this.foundProduct.quantity) {
      M.toast({ html: `Error: La cantidad a salir (${quantityToExit}) es mayor que la cantidad disponible (${this.foundProduct.quantity}).` });
      return;
    }

    const updatedProduct: Product = {
      ...this.foundProduct,
      quantity: this.foundProduct.quantity - quantityToExit,
      updated_at: new Date() // Update timestamp
    };

    this.productService.putProduct(updatedProduct.id_product || '', updatedProduct).then(
      (response: any) => {
        M.toast({ html: `Salida de ${quantityToExit} unidades de "${updatedProduct.name}" exitosa.` });
        this.foundProduct = updatedProduct; // Update displayed product
        // Re-load all products to ensure updated data for new searches
        this.loadAllProducts();
        this.exitForm.reset();
        this.searchForm.reset();
        M.updateTextFields();
      },
      (error) => {
        M.toast({ html: 'Error al registrar la salida del producto.' });
        console.error('Error exiting product:', error);
      }
    );
  }

  // Helper methods to get names for display
  getCategoryName(id: string | undefined): string {
    if (!id) return 'N/A';
    const category = this.categories.find(c => c.id_category === id);
    return category ? category.name : 'Desconocida';
  }

  getProviderName(id: string | undefined): string {
    if (!id) return 'N/A';
    const provider = this.providers.find(p => p.id_providers === id);
    return provider ? provider.legal_name : 'Desconocido';
  }

  getSubcategoryName(id: string | undefined): string {
    if (!id) return 'N/A';
    const subcategory = this.subcategories.find(s => s.id_subcategory === id);
    return subcategory ? subcategory.name : 'Desconocida';
  }
}