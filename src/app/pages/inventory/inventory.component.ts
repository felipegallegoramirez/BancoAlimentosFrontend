import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { Provider } from '../../models/provider.model';
import { ProviderService } from '../../services/provider.service';
import { Subcategory } from '../../models/subcategory.model';
import { SubcategoryService } from '../../services/subcategory.service';

declare const M: any; // Declare M for Materialize CSS functions

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, AfterViewInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  providers: Provider[] = [];
  subcategories: Subcategory[] = [];

  searchTerm: string = '';
  showAdvancedFilter: boolean = false;
  advancedFilter: any = {
    id_category: '',
    id_provider: '',
    entry_date: ''
  };

  expandedProductIndex: number | null = null;

  productForm: FormGroup;
  isEditMode: boolean = false;
  currentProductId: string | null = null;
  modalInstance: any;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private subcategoryService: SubcategoryService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      id_product: [''],
      name: ['', Validators.required],
      entry_date: ['', Validators.required],
      expiration_date: [''],
      received_by: [''],
      headquarters: [''],
      place_in_inventory: [''],
      quantity: [null, [Validators.required, Validators.min(0)]],
      unit: [null],
      lot: [''],
      id_category: ['', Validators.required],
      id_state_product: [''],
      id_subcategory: [''],
      id_provider: ['', Validators.required],
      invoice_number: [''],
      code: [''],
      unit_weight: [''],
      total_weight: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadProviders();
    this.loadSubcategories();
  }

  ngAfterViewInit(): void {
    // Initialize Materialize modal
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      this.modalInstance = M.Modal.init(modalElement, {
        onCloseEnd: () => {
          this.productForm.reset();
          this.isEditMode = false;
          this.currentProductId = null;
        }
      });
    }

    // Initialize Materialize selects
    setTimeout(() => {
      M.FormSelect.init(document.querySelectorAll('select'));
      M.Datepicker.init(document.querySelectorAll('.datepicker'), {
        format: 'yyyy-mm-dd',
        autoClose: true
      });
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.modalInstance) {
      this.modalInstance.destroy();
    }
  }

  loadProducts(): void {
    this.productService.getProducts().then(
      (data: any) => {
        console.log(data);
        this.products = data;
        this.applyFilter(); // Apply initial filter
      },
      error => {
        console.error('Error loading products:', error);
        M.toast({ html: 'Error al cargar productos.', classes: 'red' });
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategorys().then(
      (data: any) => {
        this.categories = data;
        this.initializeSelects();
      },
      error => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadProviders(): void {
    this.providerService.getProviders().then(
      (data: any) => {
        this.providers = data;
        this.initializeSelects();
      },
      error => {
        console.error('Error loading providers:', error);
      }
    );
  }

  loadSubcategories(): void {
    this.subcategoryService.getSubcategorys().then(
      (data: any) => {
        this.subcategories = data;
        this.initializeSelects();
      },
      error => {
        console.error('Error loading subcategories:', error);
      }
    );
  }

  initializeSelects(): void {
    setTimeout(() => {
      const selects = document.querySelectorAll('select');
      if (selects.length > 0) {
        M.FormSelect.init(selects);
      }
    }, 100);
  }

  applyFilter(): void {
    let tempProducts = this.products;

    // Normal filter
    if (this.searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.lot.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Advanced filter
    if (this.showAdvancedFilter) {
      if (this.advancedFilter.id_category) {
        tempProducts = tempProducts.filter(product => product.id_category === this.advancedFilter.id_category);
      }
      if (this.advancedFilter.id_provider) {
        tempProducts = tempProducts.filter(product => product.id_provider === this.advancedFilter.id_provider);
      }
      if (this.advancedFilter.entry_date) {
        const filterDate = new Date(this.advancedFilter.entry_date).toISOString().split('T')[0];
        tempProducts = tempProducts.filter(product => {
          const productEntryDate = new Date(product.entry_date).toISOString().split('T')[0];
          return productEntryDate === filterDate;
        });
      }
    }

    this.filteredProducts = tempProducts;
  }

  toggleAdvancedFilter(): void {
    this.showAdvancedFilter = !this.showAdvancedFilter;
    if (!this.showAdvancedFilter) {
      this.clearAdvancedFilter(); // Clear filters when hiding
    }
  }

  applyAdvancedFilter(): void {
    this.applyFilter();
  }

  clearAdvancedFilter(): void {
    this.advancedFilter = {
      id_category: '',
      id_provider: '',
      entry_date: ''
    };
    // Re-initialize selects to show default option
    setTimeout(() => M.FormSelect.init(document.querySelectorAll('select')), 0);
    this.applyFilter();
  }

  toggleDetails(index: number): void {
    this.expandedProductIndex = this.expandedProductIndex === index ? null : index;
  }

  openProductModal(product: Product | null): void {
    this.isEditMode = !!product;
    if (product) {
      this.currentProductId = product.id_product || null;
      const formattedProduct = {
        ...product,
        entry_date: product.entry_date ? new Date(product.entry_date).toISOString().split('T')[0] : '',
        expiration_date: product.expiration_date ? new Date(product.expiration_date).toISOString().split('T')[0] : ''
      };
      this.productForm.patchValue(formattedProduct);
      
      setTimeout(() => {
        M.updateTextFields();
        this.initializeSelects();
      }, 100);
    } else {
      this.productForm.reset();
      setTimeout(() => {
        this.initializeSelects();
        M.updateTextFields();
      }, 100);
    }
    this.modalInstance.open();
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      M.toast({ html: 'Por favor, completa todos los campos requeridos.', classes: 'red' });
      this.productForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }

    const productData: Product = this.productForm.value;

    if (this.isEditMode && this.currentProductId) {
      // For PUT, ensure id_product is set if the backend expects it in the body or URL
      productData.id_product = this.currentProductId;
      this.productService.putProduct(this.currentProductId, productData).then(
        (response: any) => {
          M.toast({ html: 'Producto actualizado exitosamente!', classes: 'green' });
          this.loadProducts();
          this.modalInstance.close();
        },
        error => {
          console.error('Error updating product:', error);
          M.toast({ html: 'Error al actualizar producto.', classes: 'red' });
        }
      );
    } else {
      // Remove id_product for POST since it's typically generated by the backend
      delete productData.id_product;
      delete productData.id_state_product;
      this.productService.postProduct(productData).then(
        (response: any) => {
          M.toast({ html: 'Producto agregado exitosamente!', classes: 'green' });
          this.loadProducts();
          this.modalInstance.close();
        },
        error => {
          console.error('Error adding product:', error);
          M.toast({ html: 'Error al agregar producto.', classes: 'red' });
        }
      );
    }
  }

  deleteProduct(id: string | undefined): void {
    if (!id) {
      M.toast({ html: 'ID de producto no válido.', classes: 'red' });
      return;
    }
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.deleteProduct(id).then(
        (response: any) => {
          M.toast({ html: 'Producto eliminado exitosamente!', classes: 'green' });
          this.loadProducts();
        },
        error => {
          console.error('Error deleting product:', error);
          M.toast({ html: 'Error al eliminar producto.', classes: 'red' });
        }
      );
    }
  }

  // Helper function to get category name by ID
  getCategoryName(id: string): string {
    const category = this.categories.find(c => c.id_category === id);
    return category ? category.name : 'Desconocida';
  }

  // Helper function to get provider name by ID
  getProviderName(id: string): string {
    const provider = this.providers.find(p => p.id_providers === id);
    return provider ? provider.legal_name : 'Desconocido';
  }

  // Helper function to get subcategory name by ID
  getSubcategoryName(id: string): string {
    const subcategory = this.subcategories.find(s => s.id_subcategory === id);
    return subcategory ? subcategory.name : 'Desconocida';
  }
}