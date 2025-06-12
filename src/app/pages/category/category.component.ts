// category.component.ts
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { Subcategory } from '../../models/subcategory.model';
import { CategoryService } from '../../services/category.service';
import { SubcategoryService } from '../../services/subcategory.service';


//TS2503: Cannot find namespace 'M'.

declare const M: any; // Declare M for Materialize CSS functions

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit, OnDestroy {
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  subcategories: Subcategory[] = [];

  categoryForm!: FormGroup;
  subcategoryForm!: FormGroup;

  categoryModalInstance: M.Modal | undefined;
  subcategoryModalInstance: M.Modal | undefined;

  isEditCategoryMode: boolean = false;
  isEditSubcategoryMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private subcategoryService: SubcategoryService
  ) {}

  ngOnInit(): void {
    this.initCategoryForm();
    this.initSubcategoryForm();
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    const categoryModalElem = document.getElementById('categoryModal');
    if (categoryModalElem) {
      this.categoryModalInstance = M.Modal.init(categoryModalElem, {
        onCloseEnd: () => {
          this.categoryForm.reset();
        }
      });
    }

    const subcategoryModalElem = document.getElementById('subcategoryModal');
    if (subcategoryModalElem) {
      this.subcategoryModalInstance = M.Modal.init(subcategoryModalElem, {
        onCloseEnd: () => {
          this.subcategoryForm.reset();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.categoryModalInstance?.destroy();
    this.subcategoryModalInstance?.destroy();
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      id_category: [''],
      name: ['', Validators.required]
    });
  }

  initSubcategoryForm(): void {
    this.subcategoryForm = this.fb.group({
      id_subcategory: [''],
      name: ['', Validators.required],
      min_items: ['', [Validators.required, Validators.min(0)]],
      id_category: ['', Validators.required]
    });
  }

  loadCategories(): void {
    this.categoryService.getCategorys().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        if (this.selectedCategory) {
          const reselected = this.categories.find(c => c.id_category === this.selectedCategory?.id_category);
          if (reselected) {
            this.selectCategory(reselected);
          } else {
            this.selectedCategory = null;
            this.subcategories = [];
          }
        }
      },
      error: (err) => {
        M.toast({ html: 'Error al cargar categorías', classes: 'red darken-2' });
        console.error(err);
      }
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.loadSubcategories(category.id_category);
  }

  loadSubcategories(categoryId: string): void {
    this.subcategoryService.getSubcategorys().subscribe({
      next: (data: Subcategory[]) => {
        this.subcategories = data.filter(sub => sub.id_category === categoryId);
      },
      error: (err) => {
        M.toast({ html: 'Error al cargar subcategorías', classes: 'red darken-2' });
        console.error(err);
      }
    });
  }

  openCategoryModal(category?: Category): void {
    this.isEditCategoryMode = !!category;
    if (category) {
      this.categoryForm.patchValue(category);
    } else {
      this.categoryForm.reset();
    }
    this.categoryModalInstance?.open();
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      M.toast({ html: 'Por favor, completa todos los campos requeridos para la categoría.', classes: 'orange darken-2' });
      return;
    }

    const categoryData: Category = this.categoryForm.value;

    if (this.isEditCategoryMode) {
      this.categoryService.putCategory(categoryData.id_category, categoryData).subscribe({
        next: () => {
          M.toast({ html: 'Categoría actualizada correctamente', classes: 'green darken-2' });
          this.loadCategories();
          this.categoryModalInstance?.close();
        },
        error: (err) => {
          M.toast({ html: 'Error al actualizar categoría', classes: 'red darken-2' });
          console.error(err);
        }
      });
    } else {
      const { id_category, ...newCategoryData } = categoryData;
      this.categoryService.postCategory(newCategoryData as Omit<Category, 'id_category'>).subscribe({
        next: () => {
          M.toast({ html: 'Categoría creada correctamente', classes: 'green darken-2' });
          this.loadCategories();
          this.categoryModalInstance?.close();
        },
        error: (err) => {
          M.toast({ html: 'Error al crear categoría', classes: 'red darken-2' });
          console.error(err);
        }
      });
    }
  }

  deleteCategory(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará sus subcategorías asociadas.')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          M.toast({ html: 'Categoría eliminada correctamente', classes: 'green darken-2' });
          this.loadCategories();
          if (this.selectedCategory?.id_category === id) {
            this.selectedCategory = null;
            this.subcategories = [];
          }
        },
        error: (err) => {
          M.toast({ html: 'Error al eliminar categoría', classes: 'red darken-2' });
          console.error(err);
        }
      });
    }
  }

  openSubcategoryModal(subcategory?: Subcategory): void {
    if (!this.selectedCategory) {
      M.toast({ html: 'Por favor, selecciona una categoría primero.', classes: 'orange darken-2' });
      return;
    }
    this.isEditSubcategoryMode = !!subcategory;
    if (subcategory) {
      this.subcategoryForm.patchValue(subcategory);
    } else {
      this.subcategoryForm.reset();
    }
    this.subcategoryForm.patchValue({ id_category: this.selectedCategory.id_category });
    this.subcategoryModalInstance?.open();
  }

  saveSubcategory(): void {
    if (this.subcategoryForm.invalid) {
      M.toast({ html: 'Por favor, completa todos los campos requeridos para la subcategoría.', classes: 'orange darken-2' });
      return;
    }

    const subcategoryData: Subcategory = this.subcategoryForm.value;
    if (!subcategoryData.id_category && this.selectedCategory) {
        subcategoryData.id_category = this.selectedCategory.id_category;
    }

    if (this.isEditSubcategoryMode) {
      this.subcategoryService.putSubcategory(subcategoryData.id_subcategory, subcategoryData).subscribe({
        next: () => {
          M.toast({ html: 'Subcategoría actualizada correctamente', classes: 'green darken-2' });
          if (this.selectedCategory) {
            this.loadSubcategories(this.selectedCategory.id_category);
          }
          this.subcategoryModalInstance?.close();
        },
        error: (err) => {
          M.toast({ html: 'Error al actualizar subcategoría', classes: 'red darken-2' });
          console.error(err);
        }
      });
    } else {
      const { id_subcategory, ...newSubcategoryData } = subcategoryData;
      this.subcategoryService.postSubcategory(newSubcategoryData as Omit<Subcategory, 'id_subcategory'>).subscribe({
        next: () => {
          M.toast({ html: 'Subcategoría creada correctamente', classes: 'green darken-2' });
          if (this.selectedCategory) {
            this.loadSubcategories(this.selectedCategory.id_category);
          }
          this.subcategoryModalInstance?.close();
        },
        error: (err) => {
          M.toast({ html: 'Error al crear subcategoría', classes: 'red darken-2' });
          console.error(err);
        }
      });
    }
  }

  deleteSubcategory(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta subcategoría?')) {
      this.subcategoryService.deleteSubcategory(id).subscribe({
        next: () => {
          M.toast({ html: 'Subcategoría eliminada correctamente', classes: 'green darken-2' });
          if (this.selectedCategory) {
            this.loadSubcategories(this.selectedCategory.id_category);
          }
        },
        error: (err) => {
          M.toast({ html: 'Error al eliminar subcategoría', classes: 'red darken-2' });
          console.error(err);
        }
      });
    }
  }
}