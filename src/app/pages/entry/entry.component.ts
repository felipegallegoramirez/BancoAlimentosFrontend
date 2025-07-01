import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Provider } from '../../models/provider.model';
import { Subcategory } from '../../models/subcategory.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProviderService } from '../../services/provider.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { NgxBarcodeScannerComponent } from '@eisberg-labs/ngx-barcode-scanner';

declare var $: any;
declare var M: any;

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  @ViewChild(NgxBarcodeScannerComponent)
  scanner!: NgxBarcodeScannerComponent;

  entryForm: FormGroup;
  categories: Category[] = [];
  providers: Provider[] = [];
  subcategories: Subcategory[] = [];
  barcodeScanning: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private subcategoryService: SubcategoryService
  ) {
    this.entryForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      invoice_number: ['', Validators.required],
      id_provider: ['', Validators.required],
      expiration_date: ['', Validators.required],
      id_category: ['', Validators.required],
      id_subcategory: ['', Validators.required],
      lot: ['', Validators.required],
      unit: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      total_weight: ['', Validators.required],
      entry_date: ['', Validators.required],
      received_by: ['', Validators.required],
      headquarters: ['', Validators.required],
      place_in_inventory: ['', Validators.required],
      id_state_product: [''],
      unit_weight: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProviders();
    this.loadSubcategories();

    $(document).ready(() => {
      $('select').formSelect();
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      this.entryForm.patchValue({ entry_date: formattedToday });
    });
  }

  loadCategories(): void {
    this.categoryService.getCategorys().then(
      (data: any) => {
        this.categories = data;
        this.initializeSelects();
      },
      (_error) => {
        M.toast({ html: 'Error al cargar categorías.' });
      }
    );
  }

  loadProviders(): void {
    this.providerService.getProviders().then(
      (data: any) => {
        this.providers = data;
        this.initializeSelects();
      },
      (_error) => {
        M.toast({ html: 'Error al cargar proveedores.' });
      }
    );
  }

  loadSubcategories(): void {
    this.subcategoryService.getSubcategorys().then(
      (data: any) => {
        this.subcategories = data;
        this.initializeSelects();
      },
      (_error) => {
        M.toast({ html: 'Error al cargar subcategorías.' });
      }
    );
  }

  private initializeSelects(): void {
    setTimeout(() => {
      const elems = document.querySelectorAll('select');
      M.FormSelect.init(elems);
    }, 100);
  }

  onSubmit(): void {
    if (this.entryForm.invalid) {
      M.toast({ html: 'Por favor, complete todos los campos requeridos.' });
      this.entryForm.markAllAsTouched();
      return;
    }

    const formData = this.entryForm.value;

    const newProduct: Product = {
      ...formData,
      expiration_date: formData.expiration_date,
      entry_date: formData.entry_date,
      id_product: 'auto-generated-' + Date.now(),
    };
    delete newProduct.id_state_product
    this.productService.postProduct(newProduct).then(
      (response: any) => {
        M.toast({ html: 'Producto ingresado exitosamente!' });
        this.entryForm.reset();
        this.entryForm.controls['id_category'].setValue('');
        this.entryForm.controls['id_provider'].setValue('');
        this.entryForm.controls['id_subcategory'].setValue('');
        setTimeout(() => $('select').formSelect(), 0);
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        this.entryForm.controls['entry_date'].setValue(formattedToday);
        M.updateTextFields();
      },
      (_error) => {
        M.toast({ html: 'Error al ingresar el producto.' });
      }
    );
  }

  openBarcodeScanner(): void {
    this.barcodeScanning = true;
  }

  onCodeChange(event: any): void {
    const code = event.value || event;
    this.entryForm.patchValue({ code: code });
    this.barcodeScanning = false;
    this.getProductByCode(code);
  }

  getProductByCode(code: string): void {
    this.productService.getProductByCode(code).then((observable) => {
      observable.subscribe({
        next: (product: Product) => {
          if (product) {
            this.entryForm.patchValue({
              name: product.name,
              id_provider: product.id_provider,
              id_category: product.id_category,
              id_subcategory: product.id_subcategory,
              unit_weight: product.unit_weight
            });
            this.initializeSelects();
            M.updateTextFields();
          } else {
            M.toast({ html: 'Producto no encontrado con este código de barras.' });
          }
        },
        error: (_error) => {
          M.toast({ html: 'Error al buscar el producto por código de barras.' });
        }
      });
    });
  }
}