// email.component.ts
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Email } from '../../models/email.model';
import { EmailService } from '../../services/email.service';

declare const M: any; // Declare M for Materialize CSS functions

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit, AfterViewInit {
  emails: Email[] = [];
  filteredEmails: Email[] = [];
  selectedEmail: Email | null = null;
  currentEmail: Email = this.getEmptyEmail(); // Used for form data (add/edit)
  isEditing: boolean = false;
  isAdding: boolean = false;
  searchTerm: string = '';

  constructor(
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.loadEmails();
  }

  ngAfterViewInit(): void {
    // Initialize Materialize components after the view has been rendered
    setTimeout(() => {
      M.updateTextFields();
    }, 0);
  }

  getEmptyEmail(): Email {
    const now = new Date();
    return {
      name_owner: '',
      email: '',
      created_at: now,
      updated_at: now,
    };
  }

  async loadEmails(): Promise<void> {
    const observable = await this.emailService.getEmails();
    if (observable) {
      observable.subscribe(
        (data: Email[]) => {
          this.emails = data;
          this.applyFilter(); // Apply filter initially to populate filteredEmails
        },
        (error) => {
          console.error('Error loading emails:', error);
          M.toast({ html: 'Error al cargar correos', classes: 'red darken-2' });
        }
      );
    } else {
      M.toast({ html: 'No tienes permisos para ver correos', classes: 'red darken-2' });
    }
  }

  selectEmail(email: Email): void {
    this.selectedEmail = email;
    this.currentEmail = { ...email }; // Copy for editing/display
    this.isEditing = false;
    this.isAdding = false;
  }

  addEmail(): void {
    this.selectedEmail = null;
    this.currentEmail = this.getEmptyEmail();
    this.isAdding = true;
    this.isEditing = false;
    setTimeout(() => {
      M.updateTextFields(); // Re-initialize Materialize text fields
    }, 0);
  }

  editEmail(email: Email): void {
    this.selectedEmail = email;
    this.currentEmail = { ...email }; // Copy for editing
    this.isEditing = true;
    this.isAdding = false;
    setTimeout(() => {
      M.updateTextFields(); // Re-initialize Materialize text fields
    }, 0);
  }

  async saveEmail(): Promise<void> {
    if (this.isAdding) {
      const observable = await this.emailService.postEmail(this.currentEmail);
      if (observable) {
        observable.subscribe(
          () => {
            M.toast({ html: 'Correo agregado exitosamente', classes: 'green darken-2' });
            this.loadEmails();
            this.cancelForm();
          },
          (error) => {
            console.error('Error adding email:', error);
            M.toast({ html: 'Error al agregar correo', classes: 'red darken-2' });
          }
        );
      } else {
        M.toast({ html: 'No tienes permisos para crear correos', classes: 'red darken-2' });
      }
    } else if (this.isEditing && this.currentEmail.id_email) {
      const observable = await this.emailService.putEmail(this.currentEmail.id_email, this.currentEmail);
      if (observable) {
        observable.subscribe(
          () => {
            M.toast({ html: 'Correo actualizado exitosamente', classes: 'green darken-2' });
            this.loadEmails();
            this.cancelForm();
          },
          (error) => {
            console.error('Error updating email:', error);
            M.toast({ html: 'Error al actualizar correo', classes: 'red darken-2' });
          }
        );
      } else {
        M.toast({ html: 'No tienes permisos para editar correos', classes: 'red darken-2' });
      }
    }
  }

  async deleteEmail(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar este correo?')) {
      const observable = await this.emailService.deleteEmail(id);
      if (observable) {
        observable.subscribe(
          () => {
            M.toast({ html: 'Correo eliminado exitosamente', classes: 'green darken-2' });
            this.loadEmails();
            this.cancelForm();
          },
          (error) => {
            console.error('Error deleting email:', error);
            M.toast({ html: 'Error al eliminar correo', classes: 'red darken-2' });
          }
        );
      } else {
        M.toast({ html: 'No tienes permisos para eliminar correos', classes: 'red darken-2' });
      }
    }
  }

  applyFilter(): void {
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    this.filteredEmails = this.emails.filter(email =>
      email.name_owner.toLowerCase().includes(lowerCaseSearchTerm) ||
      email.email.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  cancelForm(): void {
    this.isAdding = false;
    this.isEditing = false;
    this.selectedEmail = null;
    this.currentEmail = this.getEmptyEmail();
  }
}