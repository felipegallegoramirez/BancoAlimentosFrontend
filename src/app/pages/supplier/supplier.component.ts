// supplier.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Provider } from '../../models/provider.model';
import { TypeDocument } from '../../models/type_document.model';
import { ProviderService } from '../../services/provider.service';
import { TypeDocumentService } from '../../services/type-document.service';

declare const M: any; // Declare M for Materialize CSS functions

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit, AfterViewInit {
  providers: Provider[] = [];
  filteredProviders: Provider[] = [];
  typeDocuments: TypeDocument[] = [];
  selectedProvider: Provider | null = null;
  currentProvider: Provider = this.getEmptyProvider(); // Used for form data (add/edit)
  isEditing: boolean = false;
  isAdding: boolean = false;
  searchTerm: string = '';

  constructor(
    private providerService: ProviderService,
    private typeDocumentService: TypeDocumentService
  ) {}

  ngOnInit(): void {
    this.loadProviders();
    this.loadTypeDocuments();
  }

  ngAfterViewInit(): void {
    // Initialize Materialize selects after the view has been rendered
    setTimeout(() => {
      M.FormSelect.init(document.querySelectorAll('select'));
    }, 0);
  }

  getEmptyProvider(): Provider {
    const now = new Date();
    return {
      id_providers: '',
      legal_name: '',
      trade_name: null,
      num_doc: '',
      id_type_doc: '',
      legal_representative: '',
      address: '',
      created_at: now,
      updated_at: now,
    };
  }

  loadProviders(): void {
    this.providerService.getProviders().then(
      (data: any) => {
        this.providers = data;
        this.applyFilter(); // Apply filter initially to populate filteredProviders
      },
      (error) => {
        console.error('Error loading providers:', error);
        M.toast({ html: 'Error al cargar proveedores', classes: 'red darken-2' });
      }
    );
  }

  loadTypeDocuments(): void {
    this.typeDocumentService.getTypeDocuments().then(
      (data: any) => {
        
        this.typeDocuments = data.data;
        console.log(this.typeDocuments);
        // Re-initialize Materialize selects after data is loaded
        setTimeout(() => {
          M.FormSelect.init(document.querySelectorAll('select'));
        }, 0);
      },
      (error) => {
        console.error('Error loading document types:', error);
        M.toast({ html: 'Error al cargar tipos de documento', classes: 'red darken-2' });
      }
    );
  }

  selectProvider(provider: Provider): void {
    this.selectedProvider = provider;
    this.currentProvider = { ...provider }; // Copy for editing/display
    this.isEditing = false;
    this.isAdding = false;
  }

  addProvider(): void {
    this.selectedProvider = null;
    this.currentProvider = this.getEmptyProvider();
    this.isAdding = true;
    this.isEditing = false;
    setTimeout(() => {
      M.updateTextFields(); // Re-initialize Materialize text fields
      M.FormSelect.init(document.querySelectorAll('select')); // Re-initialize Materialize selects
    }, 0);
  }

  editProvider(provider: Provider): void {
    this.selectedProvider = provider;
    this.currentProvider = { ...provider }; // Copy for editing
    this.isEditing = true;
    this.isAdding = false;
    setTimeout(() => {
      M.updateTextFields(); // Re-initialize Materialize text fields
      M.FormSelect.init(document.querySelectorAll('select')); // Re-initialize Materialize selects
    }, 0);
  }

  saveProvider(): void {
    if (this.isAdding) {
      this.providerService.postProvider(this.currentProvider).then(
        () => {
          M.toast({ html: 'Proveedor agregado exitosamente', classes: 'green darken-2' });
          this.loadProviders();
          this.cancelForm();
        },
        (error) => {
          console.error('Error adding provider:', error);
          M.toast({ html: 'Error al agregar proveedor', classes: 'red darken-2' });
        }
      );
    } else if (this.isEditing && this.currentProvider.id_providers) {
      this.providerService.putProvider(this.currentProvider.id_providers, this.currentProvider).then(
        () => {
          M.toast({ html: 'Proveedor actualizado exitosamente', classes: 'green darken-2' });
          this.loadProviders();
          this.cancelForm();
        },
        (error) => {
          console.error('Error updating provider:', error);
          M.toast({ html: 'Error al actualizar proveedor', classes: 'red darken-2' });
        }
      );
    }
  }

  deleteProvider(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      this.providerService.deleteProvider(id).then(
        () => {
          M.toast({ html: 'Proveedor eliminado exitosamente', classes: 'green darken-2' });
          this.loadProviders();
          this.cancelForm();
        },
        (error) => {
          console.error('Error deleting provider:', error);
          M.toast({ html: 'Error al eliminar proveedor', classes: 'red darken-2' });
        }
      );
    }
  }

  applyFilter(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredProviders = this.providers.filter(provider =>
      provider.legal_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (provider.trade_name && provider.trade_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      provider.num_doc.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  cancelForm(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.selectedProvider = null;
    this.currentProvider = this.getEmptyProvider();
  }
}