// donor.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Donor } from '../../models/donor.model';
import { TypeDocument } from '../../models/type_document.model';
import { DonorService } from '../../services/donor.service';
import { TypeDocumentService } from '../../services/type-document.service';

declare const M: any; // Declare M for Materialize CSS functions

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent implements OnInit, AfterViewInit {
  donors: Donor[] = [];
  filteredDonors: Donor[] = [];
  typeDocuments: TypeDocument[] = [];
  selectedDonor: Donor | null = null;
  currentDonor: Donor = this.getEmptyDonor(); // Used for form data (add/edit)
  isEditing: boolean = false;
  isAdding: boolean = false;
  searchTerm: string = '';

  constructor(
    private donorService: DonorService,
    private typeDocumentService: TypeDocumentService
  ) {}

  ngOnInit(): void {
    this.loadDonors();
    this.loadTypeDocuments();
  }

  ngAfterViewInit(): void {
    // Initialize Materialize selects after the view has been rendered
    setTimeout(() => {
      M.FormSelect.init(document.querySelectorAll('select'));
    }, 0);
  }

  getEmptyDonor(): Donor {
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

  loadDonors(): void {
    this.donorService.getDonors().then(
      (data: Donor[]) => {
        this.donors = data;
        this.applyFilter(); // Apply filter initially to populate filteredDonors
      },
      (error) => {
        console.error('Error loading donors:', error);
        M.toast({ html: 'Error al cargar donantes', classes: 'red darken-2' });
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

  selectDonor(donor: Donor): void {
    this.selectedDonor = donor;
    this.currentDonor = { ...donor }; // Copy for editing/display
    this.isEditing = false;
    this.isAdding = false;
  }

  addDonor(): void {
    this.selectedDonor = null;
    this.currentDonor = this.getEmptyDonor();
    this.isAdding = true;
    this.isEditing = false;
    setTimeout(() => {
      M.updateTextFields(); // Re-initialize Materialize text fields
      M.FormSelect.init(document.querySelectorAll('select')); // Re-initialize Materialize selects
    }, 0);
  }

  editDonor(donor: Donor): void {
    this.selectedDonor = donor;
    this.currentDonor = { ...donor }; // Copy for editing
    this.isEditing = true;
    this.isAdding = false;
    setTimeout(() => {
      M.updateTextFields(); // Re-initialize Materialize text fields
      M.FormSelect.init(document.querySelectorAll('select')); // Re-initialize Materialize selects
    }, 0);
  }

  saveDonor(): void {
    if (this.isAdding) {
      this.donorService.postDonor(this.currentDonor).then(
        () => {
          M.toast({ html: 'Donante agregado exitosamente', classes: 'green darken-2' });
          this.loadDonors();
          this.cancelForm();
        },
        (error) => {
          console.error('Error adding donor:', error);
          M.toast({ html: 'Error al agregar donante', classes: 'red darken-2' });
        }
      );
    } else if (this.isEditing && this.currentDonor.id_providers) {
      this.donorService.putDonor(this.currentDonor.id_providers, this.currentDonor).then(
        () => {
          M.toast({ html: 'Donante actualizado exitosamente', classes: 'green darken-2' });
          this.loadDonors();
          this.cancelForm();
        },
        (error) => {
          console.error('Error updating donor:', error);
          M.toast({ html: 'Error al actualizar donante', classes: 'red darken-2' });
        }
      );
    }
  }

  deleteDonor(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este donante?')) {
      this.donorService.deleteDonor(id).then(
        () => {
          M.toast({ html: 'Donante eliminado exitosamente', classes: 'green darken-2' });
          this.loadDonors();
          this.cancelForm();
        },
        (error) => {
          console.error('Error deleting donor:', error);
          M.toast({ html: 'Error al eliminar donante', classes: 'red darken-2' });
        }
      );
    }
  }

  applyFilter(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredDonors = this.donors.filter(donor =>
      donor.legal_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      (donor.trade_name && donor.trade_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
      donor.num_doc.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  cancelForm(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.selectedDonor = null;
    this.currentDonor = this.getEmptyDonor();
  }
}