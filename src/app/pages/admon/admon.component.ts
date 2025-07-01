// admon.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { TypeDocumentService } from '../../services/type-document.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { TypeDocument } from '../../models/type_document.model';
import { Subscription } from 'rxjs';
import M from 'materialize-css';

@Component({
  selector: 'app-admon',
  templateUrl: './admon.component.html',
  styleUrls: ['./admon.component.css']
})
export class AdmonComponent implements OnInit, OnDestroy {
  users: User[] = [];
  roles: Role[] = [];
  typeDocuments: TypeDocument[] = [];
  selectedUser: User | null = null;
  isEditing: boolean = false;
  isAdding: boolean = false;
  newUser: User = this.getEmptyUser();

  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private typeDocumentService: TypeDocumentService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadTypeDocuments();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getEmptyUser(): User {
    return {
      id_user: '',
      name: '',
      lastname: '',
      num_doc: '',
      email: '',
      password: '',
      id_role: '',
      id_type_doc: '',
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async loadUsers(): Promise<void> {
    const observable = await this.userService.getUsers();
    if (observable) {
      const sub = observable.subscribe({
        next: (data: User[]) => {
          this.users = data;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          M.toast({ html: 'Error al cargar usuarios', classes: 'red' });
        }
      });
      this.subscriptions.push(sub);
    }
  }

  async loadRoles(): Promise<void> {
    const observable = await this.roleService.getRoles();
    if (observable) {
      const sub = observable.subscribe({
        next: (data: Role[]) => {
          this.roles = data;
          this.initializeSelectInputs();
        },
        error: (error) => {
          console.error('Error loading roles:', error);
          M.toast({ html: 'Error al cargar roles', classes: 'red' });
        }
      });
      this.subscriptions.push(sub);
    }
  }

  async loadTypeDocuments(): Promise<void> {
    const observable = await this.typeDocumentService.getTypeDocuments();
    if (observable) {
      const sub = observable.subscribe({
        next: (data: any) => {
          this.typeDocuments = data.data;
          this.initializeSelectInputs();
        },
        error: (error) => {
          console.error('Error loading document types:', error);
          M.toast({ html: 'Error al cargar tipos de documento', classes: 'red' });
        }
      });
      this.subscriptions.push(sub);
    }
  }

  initializeSelectInputs(): void {
    setTimeout(() => {
      const selects = document.querySelectorAll('select');
      M.FormSelect.init(selects);
    }, 0);
  }

  viewUserDetails(user: User): void {
    this.selectedUser = { ...user }; // Create a copy to avoid direct mutation
    this.isEditing = false;
    this.isAdding = false;
    setTimeout(() => {
      M.updateTextFields();
      this.initializeSelectInputs();
    }, 0);
  }

  editUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.isAdding = false;
    setTimeout(() => {
      M.updateTextFields();
      this.initializeSelectInputs();
    }, 0);
  }

  async saveUserChanges(): Promise<void> {
    if (this.selectedUser) {
      const observable = await this.userService.putUser(this.selectedUser.id_user, this.selectedUser);
      if (observable) {
        const sub = observable.subscribe({
          next: (updatedUser) => {
            M.toast({ html: 'Usuario actualizado correctamente', classes: 'green' });
            this.loadUsers();
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Error updating user:', error);
            M.toast({ html: 'Error al actualizar usuario', classes: 'red' });
          }
        });
        this.subscriptions.push(sub);
      }
    }
  }

  addUser(): void {
    this.newUser = this.getEmptyUser();
    this.isAdding = true;
    this.isEditing = false;
    this.selectedUser = null;
    setTimeout(() => {
      M.updateTextFields();
      this.initializeSelectInputs();
    }, 0);
  }

  async createNewUser(): Promise<void> {
    const observable = await this.userService.postUser(this.newUser);
    if (observable) {
      const sub = observable.subscribe({
        next: (createdUser) => {
          M.toast({ html: 'Usuario creado correctamente', classes: 'green' });
          this.loadUsers();
          this.cancelAdd();
        },
        error: (error) => {
          console.error('Error creating user:', error);
          M.toast({ html: 'Error al crear usuario', classes: 'red' });
        }
      });
      this.subscriptions.push(sub);
    }
  }

  async deleteUser(id_user: string): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const observable = await this.userService.deleteUser(id_user);
      if (observable) {
        const sub = observable.subscribe({
          next: () => {
            M.toast({ html: 'Usuario eliminado correctamente', classes: 'green' });
            this.loadUsers();
            this.selectedUser = null; // Clear selection after deletion
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            M.toast({ html: 'Error al eliminar usuario', classes: 'red' });
          }
        });
        this.subscriptions.push(sub);
      }
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.selectedUser = null;
  }

  cancelAdd(): void {
    this.isAdding = false;
    this.newUser = this.getEmptyUser();
  }

  getRoleName(id_role: string): string {
    const role = this.roles.find(r => r.id_role === id_role);
    return role?.name || 'N/A';
  }

  getDocumentTypeName(id_type_doc: string): string {
    const typeDoc = this.typeDocuments.find(td => td.id_document === id_type_doc);
    return typeDoc?.name || 'N/A';
  }
}