// src/app/exit/exit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { Provider } from '../../models/provider.model';
import { Subcategory } from '../../models/subcategory.model';
import { Exit } from '../../models/exit.model';
import { Beneficiary } from '../../models/beneficiary.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProviderService } from '../../services/provider.service';
import { SubcategoryService } from '../../services/subcategory.service';
import { ExitService } from '../../services/exit.service';
import { BeneficiaryService } from '../../services/beneficiary.service';

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
  beneficiaries: Beneficiary[] = [];
  products: Product[] = []; // To hold all products for search filtering

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private providerService: ProviderService,
    private subcategoryService: SubcategoryService,
    private exitService: ExitService,
    private beneficiaryService: BeneficiaryService
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['', Validators.required]
    });

    this.exitForm = this.fb.group({
      quantityToExit: [0, [Validators.required, Validators.min(1)]],
      beneficiaryId: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.loadAllProducts(); // Load all products for client-side search
    this.loadCategories();
    this.loadProviders();
    this.loadSubcategories();
    this.loadBeneficiaries();

    $(document).ready(() => {
      this.initializeSelect();
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

  loadBeneficiaries(): void {
    console.log('Iniciando carga de beneficiarios...');
    this.beneficiaryService.getBeneficiarys().then(
      (data: any) => {
        console.log('Respuesta del servicio de beneficiarios:', data);
        this.beneficiaries = data || [];
        console.log('Beneficiarios cargados:', this.beneficiaries);
        
        if (this.beneficiaries.length > 0) {
          M.toast({ html: `${this.beneficiaries.length} beneficiarios cargados exitosamente.` });
        } else {
          M.toast({ html: 'No hay beneficiarios registrados. Debe registrar beneficiarios antes de hacer salidas.' });
        }
        
        // Reinicializar el select de Materialize después de cargar los datos
        setTimeout(() => {
          this.initializeSelect();
        }, 100);
      },
      (error) => {
        console.error('Error loading beneficiaries:', error);
        M.toast({ html: 'Error al cargar beneficiarios. Verifique su conexión y permisos.' });
        this.beneficiaries = [];
      }
    );
  }

  initializeSelect(): void {
    try {
      console.log('Iniciando initializeSelect...');
      
      // Destruir instancias existentes del select
      const selectElement = document.getElementById('beneficiary-select');
      if (selectElement) {
        const instance = M.FormSelect.getInstance(selectElement);
        if (instance) {
          instance.destroy();
          console.log('Instancia anterior del select destruida');
        }
      }
      
      // Esperar un poco para que el DOM se actualice
      setTimeout(() => {
        // Intentar con Materialize primero
        const selects = document.querySelectorAll('select');
        console.log('Elementos select encontrados:', selects.length);
        
        if (selects.length > 0) {
          M.FormSelect.init(selects);
          console.log('Select de beneficiarios inicializado con Materialize');
          
          // Verificar que el select esté funcionando
          const beneficiarySelect = document.getElementById('beneficiary-select');
          if (beneficiarySelect) {
            console.log('Select de beneficiarios encontrado en DOM');
            console.log('Número de opciones:', beneficiarySelect.querySelectorAll('option').length);
            
            // Agregar event listener para detectar cambios
            beneficiarySelect.addEventListener('change', (event) => {
              const target = event.target as HTMLSelectElement;
              console.log('Cambio detectado en select:', target.value);
              this.exitForm.controls['beneficiaryId'].setValue(target.value);
            });
          }
        } else {
          console.warn('No se encontraron elementos select en el DOM');
        }
        
        // Como respaldo, también intentar con jQuery
        setTimeout(() => {
          try {
            $('select').formSelect();
            console.log('Select de beneficiarios inicializado con jQuery como respaldo');
          } catch (jqueryError) {
            console.error('Error con jQuery:', jqueryError);
          }
        }, 50);
        
      }, 100);
      
    } catch (error) {
      console.error('Error al inicializar select con Materialize:', error);
      // Intentar con jQuery como respaldo
      try {
        $('select').formSelect();
        console.log('Select de beneficiarios inicializado con jQuery como respaldo');
      } catch (jqueryError) {
        console.error('Error con jQuery:', jqueryError);
      }
    }
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
      
      // Reinicializar el select cuando se encuentra un producto
      setTimeout(() => {
        this.initializeSelect();
      }, 100);
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

    if (this.beneficiaries.length === 0) {
      M.toast({ html: 'No hay beneficiarios registrados. Debe registrar beneficiarios antes de hacer salidas.' });
      return;
    }

    // Verificar el estado del formulario
    console.log('Estado del formulario:', this.exitForm.status);
    console.log('Formulario válido:', this.exitForm.valid);
    console.log('Formulario inválido:', this.exitForm.invalid);
    console.log('Errores del formulario:', this.exitForm.errors);
    console.log('Errores de beneficiaryId:', this.exitForm.get('beneficiaryId')?.errors);
    console.log('Valor de beneficiaryId:', this.exitForm.get('beneficiaryId')?.value);
    console.log('Touched de beneficiaryId:', this.exitForm.get('beneficiaryId')?.touched);

    if (this.exitForm.invalid) {
      M.toast({ html: 'Por favor, complete todos los campos requeridos.' });
      return;
    }

    const quantityToExit = this.exitForm.controls['quantityToExit'].value;
    const beneficiaryId = this.exitForm.controls['beneficiaryId'].value;

    // Agregar logs de depuración
    console.log('Valor del formulario completo:', this.exitForm.value);
    console.log('beneficiaryId extraído:', beneficiaryId);
    console.log('Tipo de beneficiaryId:', typeof beneficiaryId);
    console.log('beneficiaryId es undefined?', beneficiaryId === undefined);
    console.log('beneficiaryId es null?', beneficiaryId === null);
    console.log('beneficiaryId es vacío?', beneficiaryId === '');

    // Validación adicional para beneficiaryId
    if (!beneficiaryId || beneficiaryId === '' || beneficiaryId === undefined || beneficiaryId === null) {
      M.toast({ html: 'Error: Debe seleccionar un beneficiario válido.' });
      console.error('beneficiaryId es inválido:', beneficiaryId);
      return;
    }

    if (quantityToExit > this.foundProduct.quantity) {
      M.toast({ html: `Error: La cantidad a salir (${quantityToExit}) es mayor que la cantidad disponible (${this.foundProduct.quantity}).` });
      return;
    }

    const exitData: Exit = {
      id_product: this.foundProduct.id_product,
      amount_product: quantityToExit,
      id_beneficiary: beneficiaryId, // Este es el id_providers del beneficiario
      id_user: localStorage.getItem('id') || ''
    };

    delete exitData.id_output;

    console.log('exitData final:', exitData);  

    this.exitService.postExit(exitData).then(
      (response: any) => {
        if (response) {
          M.toast({ html: `Salida de ${quantityToExit} unidades de "${this.foundProduct?.name}" registrada exitosamente.` });
          
          // Actualizar la cantidad del producto mostrado (el backend ya actualizó el inventario)
          if (this.foundProduct) {
            this.foundProduct.quantity -= quantityToExit;
          }
          
          // Recargar todos los productos para asegurar datos actualizados
          this.loadAllProducts();
          this.exitForm.reset();
          this.searchForm.reset();
          M.updateTextFields();
          // Reinicializar el select después del reset
          setTimeout(() => {
            this.initializeSelect();
          }, 100);
        } else {
          M.toast({ html: 'No tiene permisos para registrar salidas.' });
        }
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

  getBeneficiaryName(id: string | undefined): string {
    if (!id) return 'N/A';
    const beneficiary = this.beneficiaries.find(b => b.id_beneficiary === id);
    return beneficiary ? beneficiary.legal_name : 'Desconocido';
  }

  // Método para manejar cambios en el select de beneficiarios
  onBeneficiaryChange(event: any): void {
    const value = event.target.value;
    console.log('Cambio detectado en beneficiario:', value);
    this.exitForm.controls['beneficiaryId'].setValue(value);
    this.exitForm.controls['beneficiaryId'].markAsTouched();
  }
}