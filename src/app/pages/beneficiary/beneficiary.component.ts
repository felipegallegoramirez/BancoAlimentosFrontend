// beneficiary.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Beneficiary } from '../../models/beneficiary.model';
import { TypeDocument } from '../../models/type_document.model';
import { BeneficiaryService } from '../../services/beneficiary.service';
import { TypeDocumentService } from '../../services/type-document.service';

declare const M: any; // Declare M for Materialize CSS functions

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.css']
})
export class BeneficiaryComponent implements OnInit, AfterViewInit {
  beneficiaries: Beneficiary[] = [];
  filteredBeneficiaries: Beneficiary[] = [];
  typeDocuments: TypeDocument[] = [];
  selectedBeneficiary: Beneficiary | null = null;
  currentBeneficiary: Beneficiary = this.getEmptyBeneficiary(); // Used for form data (add/edit)
  isEditing: boolean = false;
  isAdding: boolean = false;
  searchTerm: string = '';

  constructor(
    private beneficiaryService: BeneficiaryService,
    private typeDocumentService: TypeDocumentService
  ) {}

  ngOnInit(): void {
    this.loadBeneficiaries();
    this.loadTypeDocuments();
  }

  ngAfterViewInit(): void {
    // Initialize Materialize selects after the view has been rendered
    setTimeout(() => {
      M.FormSelect.init(document.querySelectorAll('select'));
    }, 0);
  }

  getEmptyBeneficiary(): Beneficiary {
    const now = new Date();
    return {
      id_beneficiary: '',
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

  loadBeneficiaries(): void {
    this.beneficiaryService.getBeneficiarys().then(
      (data: Beneficiary[]) => {
        this.beneficiaries = data;
        this.applyFilter(); // Apply filter initially to populate filteredBeneficiaries
      },
      (error) => {
        console.error('Error loading beneficiaries:', error);
        M.toast({ html: 'Error al cargar beneficiarios', classes: 'red darken-2' });
      }
    );
  }

  loadTypeDocuments(): void {
    this.typeDocumentService.getTypeDocuments().subscribe(
      (data: any) => {
        
        this.typeDocuments = data?.data as TypeDocument[];
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

  selectBeneficiary(beneficiary: Beneficiary): void {
    this.selectedBeneficiary = beneficiary;
    this.currentBeneficiary = { ...beneficiary }; // Copy for editing/display
    this.isEditing = false;
    this.isAdding = false;
  }

  addBeneficiary(): void {
    this.selectedBeneficiary = null;
    this.currentBeneficiary = this.getEmptyBeneficiary();
    this.isAdding = true;
    this.isEditing = false;
    setTimeout(() => {
      M.updateTextFields(); // Re-initialize Materialize text fields
      M.FormSelect.init(document.querySelectorAll('select')); // Re-initialize Materialize selects
    }, 0);
  }

  editBeneficiary(beneficiary: Beneficiary): void {
    this.selectedBeneficiary = beneficiary;
    this.currentBeneficiary = { ...beneficiary }; // Copy for editing
    this.isEditing = true;
    this.isAdding = false;
    setTimeout(() => {
      M.updateTextFields(); // Re-initialize Materialize text fields
      M.FormSelect.init(document.querySelectorAll('select')); // Re-initialize Materialize selects
    }, 0);
  }

  saveBeneficiary(): void {
    if (this.isAdding) {
      this.beneficiaryService.postBeneficiary(this.currentBeneficiary).then(
        () => {
          M.toast({ html: 'Beneficiario agregado exitosamente', classes: 'green darken-2' });
          this.loadBeneficiaries();
          this.cancelForm();
        },
        (error) => {
          console.error('Error adding beneficiary:', error);
          M.toast({ html: 'Error al agregar beneficiario', classes: 'red darken-2' });
        }
      );
    } else if (this.isEditing && this.currentBeneficiary.id_beneficiary) {
      this.beneficiaryService.putBeneficiary(this.currentBeneficiary.id_beneficiary, this.currentBeneficiary).then(
        () => {
          M.toast({ html: 'Beneficiario actualizado exitosamente', classes: 'green darken-2' });
          this.loadBeneficiaries();
          this.cancelForm();
        },
        (error) => {
          console.error('Error updating beneficiary:', error);
          M.toast({ html: 'Error al actualizar beneficiario', classes: 'red darken-2' });
        }
      );
    }
  }

  deleteBeneficiary(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este beneficiario?')) {
      this.beneficiaryService.deleteBeneficiary(id).then(
        () => {
          M.toast({ html: 'Beneficiario eliminado exitosamente', classes: 'green darken-2' });
          this.loadBeneficiaries();
          this.cancelForm();
        },
        (error) => {
          console.error('Error deleting beneficiary:', error);
          M.toast({ html: 'Error al eliminar beneficiario', classes: 'red darken-2' });
        }
      );
    }
  }

  applyFilter(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredBeneficiaries = this.beneficiaries.filter(beneficiary =>
      beneficiary.legal_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (beneficiary.trade_name && beneficiary.trade_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      beneficiary.num_doc.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  cancelForm(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.selectedBeneficiary = null;
    this.currentBeneficiary = this.getEmptyBeneficiary();
  }
}