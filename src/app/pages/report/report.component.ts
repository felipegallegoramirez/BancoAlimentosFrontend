import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Report } from '../../models/report.model'; // Asegúrate de que esta ruta sea correcta
import { ReportService } from '../../services/report.service'; // Asegúrate de que esta ruta sea correcta
import * as M from 'materialize-css';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * @description Componente para el manejo de reportes.
 * Permite visualizar, añadir, editar y eliminar reportes, además de ofrecer funcionalidades de filtrado.
 */
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  // Almacena todos los reportes obtenidos del backend
  public reports: Report[] = [];
  // Almacena los reportes que se muestran en la tabla después de aplicar filtros
  public filteredReports: Report[] = [];
  // Almacena el reporte seleccionado para edición o visualización de detalles
  public selectedReport: Report | null = null;
  // Formulario para la creación o edición de reportes
  public reportForm: FormGroup;
  // Instancia del modal de Materialize para añadir/editar reportes
  public addEditModalInstance: M.Modal | undefined;
  // Instancia del modal de Materialize para ver detalles de un reporte
  public detailModalInstance: M.Modal | undefined;

  // Propiedad para el filtro de búsqueda normal
  public searchTerm: string = '';
  // Propiedad para controlar la visibilidad del panel de filtro avanzado
  public showAdvancedFilter: boolean = false;
  // Propiedades para los filtros avanzados
  public advancedFilters = {
    report_date_start: '',
    report_date_end: '',
    made_by: '',
    comment: ''
  };

  // Un Subject para gestionar la desuscripción de Observables al destruir el componente
  private destroy$ = new Subject<void>();

  /**
   * @description Constructor del componente.
   * Inicializa el FormBuilder y el ReportService.
   * @param fb Constructor de formularios para Angular Reactive Forms.
   * @param reportService Servicio que interactúa con la API de reportes.
   */
  constructor(
    private fb: FormBuilder,
    private reportService: ReportService
  ) {
    // Inicialización del formulario con sus campos y validadores
    this.reportForm = this.fb.group({
      // id_report no se incluye ya que se genera automáticamente en el backend y no se edita directamente
      report_date: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      made_by: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  /**
   * @description Hook del ciclo de vida que se ejecuta al inicializar el componente.
   * Carga los reportes y inicializa los componentes de Materialize (modales, datepickers).
   */
  ngOnInit(): void {
    this.getReports(); // Carga inicial de los reportes
    this.initMaterializeModals(); // Inicializa los modales
    this.initMaterializeDatepickers(); // Inicializa los datepickers
  }

  /**
   * @description Hook del ciclo de vida que se ejecuta al destruir el componente.
   * Desuscribe todos los observables para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Destruir instancias de Materialize si es necesario para evitar problemas
    this.addEditModalInstance?.destroy();
    this.detailModalInstance?.destroy();
  }

  /**
   * @description Inicializa los modales de Materialize.
   * Obtiene las referencias de los elementos del DOM y crea las instancias de los modales.
   */
  private initMaterializeModals(): void {
    const addEditModalElement = document.getElementById('addEditReportModal');
    const detailModalElement = document.getElementById('reportDetailModal');

    if (addEditModalElement) {
      this.addEditModalInstance = M.Modal.init(addEditModalElement, {});
    }
    if (detailModalElement) {
      this.detailModalInstance = M.Modal.init(detailModalElement, {});
    }
  }

  /**
   * @description Inicializa los datepickers de Materialize para los campos de fecha.
   * Asocia los datepickers con los campos de fecha del formulario y los filtros.
   */
  private initMaterializeDatepickers(): void {
    const datepickerElements = document.querySelectorAll('.datepicker');
    datepickerElements.forEach(element => {
      M.Datepicker.init(element, {
        format: 'yyyy-mm-dd',
        autoClose: true,
        onClose: () => {
          const instance = M.Datepicker.getInstance(element);
          if (!instance) return;
          
          const formattedDate = instance.toString();
          const elementId = element.id;

          if (this.reportForm.contains(elementId)) {
            this.reportForm.get(elementId)?.setValue(formattedDate);
          } else if (elementId === 'advanced_report_date_start') {
            this.advancedFilters.report_date_start = formattedDate;
          } else if (elementId === 'advanced_report_date_end') {
            this.advancedFilters.report_date_end = formattedDate;
          }
        }
      });
    });
  }

  /**
   * @description Obtiene todos los reportes desde el servicio y los asigna a `reports` y `filteredReports`.
   */
  public getReports(): void {
    this.reportService.getReports()
      .then((observable) => {
        observable.pipe(takeUntil(this.destroy$)) // Desuscribe automáticamente cuando el componente se destruye
          .subscribe({
            next: (data: Report[]) => {
              this.reports = data;
              this.applyFilters(); // Aplica los filtros iniciales después de cargar los datos
            },
            error: (err) => {
              console.error('Error al obtener reportes:', err);
              M.toast({ html: 'Error al cargar los reportes', classes: 'red' });
            }
          });
      });
  }

  /**
   * @description Abre el modal para añadir un nuevo reporte.
   * Resetea el formulario y el reporte seleccionado.
   */
  public openAddModal(): void {
    this.selectedReport = null;
    this.reportForm.reset();
    this.reportForm.patchValue({
      report_date: '',
      start_date: '',
      end_date: ''
    });
    this.addEditModalInstance?.open();
    // Esperar a que el modal esté completamente abierto antes de inicializar los datepickers
    setTimeout(() => {
      this.initMaterializeDatepickers();
      // Reinicializar tooltips si los hay
      const tooltips = document.querySelectorAll('.tooltipped');
      tooltips.forEach(tooltip => M.Tooltip.init(tooltip));
    }, 300);
  }

  /**
   * @description Abre el modal para editar un reporte existente.
   * Rellena el formulario con los datos del reporte seleccionado.
   * @param report El objeto Report a editar.
   */
  public openEditModal(report: Report): void {
    this.selectedReport = { ...report };
    this.reportForm.patchValue({
      report_date: report.report_date,
      start_date: report.start_date,
      end_date: report.end_date,
      made_by: report.made_by,
      comment: report.comment
    });
    this.addEditModalInstance?.open();
    // Esperar a que el modal esté completamente abierto antes de inicializar los datepickers
    setTimeout(() => {
      this.initMaterializeDatepickers();
      // Reinicializar tooltips si los hay
      const tooltips = document.querySelectorAll('.tooltipped');
      tooltips.forEach(tooltip => M.Tooltip.init(tooltip));
    }, 300);
  }

  /**
   * @description Abre el modal para ver los detalles completos de un reporte.
   * @param report El objeto Report a visualizar.
   */
  public openDetailModal(report: Report): void {
    this.selectedReport = { ...report }; // Asigna el reporte para mostrar en el modal de detalles
    this.detailModalInstance?.open(); // Abre el modal de detalles
  }

  /**
   * @description Guarda un reporte (crea uno nuevo o actualiza uno existente).
   * Determina si es una operación de 'post' o 'put' basándose en si `selectedReport` está seteado.
   */
  public saveReport(): void {
    if (this.reportForm.invalid) {
      M.toast({ html: 'Por favor, complete todos los campos requeridos.', classes: 'red' });
      return;
    }

    const reportData = this.reportForm.value;

    if (this.selectedReport && this.selectedReport.id_report) {
      // Si hay un reporte seleccionado y tiene un ID, es una actualización (PUT)
      this.reportService.putReport(this.selectedReport.id_report, reportData)
        .then((observable) => {
          observable.pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (updatedReport) => {
                M.toast({ html: 'Reporte actualizado con éxito!', classes: 'green' });
                this.getReports(); // Recarga la lista de reportes para mostrar el cambio
                this.addEditModalInstance?.close(); // Cierra el modal
              },
              error: (err) => {
                console.error('Error al actualizar reporte:', err);
                M.toast({ html: 'Error al actualizar el reporte', classes: 'red' });
              }
            });
        });
    } else {
      // Si no hay reporte seleccionado o no tiene ID, es una creación (POST)
      this.reportService.postReport(reportData)
        .then((observable) => {
          observable.pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (newReport) => {
                M.toast({ html: 'Reporte creado con éxito!', classes: 'green' });
                this.getReports(); // Recarga la lista de reportes
                this.addEditModalInstance?.close(); // Cierra el modal
              },
              error: (err) => {
                console.error('Error al crear reporte:', err);
                M.toast({ html: 'Error al crear el reporte', classes: 'red' });
              }
            });
        });
    }
  }

  /**
   * @description Elimina un reporte.
   * Confirma con el usuario antes de proceder con la eliminación.
   * @param id_report El ID del reporte a eliminar.
   */
  public deleteReport(id_report: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      this.reportService.deleteReport(id_report)
        .then((observable) => {
          observable.pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                M.toast({ html: 'Reporte eliminado con éxito!', classes: 'green' });
                this.getReports(); // Recarga la lista de reportes
              },
              error: (err) => {
                console.error('Error al eliminar reporte:', err);
                M.toast({ html: 'Error al eliminar el reporte', classes: 'red' });
              }
            });
        });
    }
  }

  /**
   * @description Alterna la visibilidad del panel de filtro avanzado.
   */
  public toggleAdvancedFilter(): void {
    this.showAdvancedFilter = !this.showAdvancedFilter;
  }

  /**
   * @description Aplica los filtros (normal y avanzado) a la lista de reportes.
   * Se llama cada vez que cambia el `searchTerm` o los `advancedFilters`.
   */
  public applyFilters(): void {
    let tempReports = [...this.reports]; // Trabaja con una copia de los reportes originales

    // Aplicar filtro de búsqueda normal
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      tempReports = tempReports.filter(report =>
        report.made_by.toLowerCase().includes(lowerCaseSearchTerm) ||
        report.comment.toLowerCase().includes(lowerCaseSearchTerm) ||
        report.report_date.includes(lowerCaseSearchTerm) ||
        report.start_date.includes(lowerCaseSearchTerm) ||
        report.end_date.includes(lowerCaseSearchTerm)
      );
    }

    // Aplicar filtros avanzados
    if (this.showAdvancedFilter) {
      if (this.advancedFilters.report_date_start) {
        tempReports = tempReports.filter(report =>
          report.report_date >= this.advancedFilters.report_date_start
        );
      }
      if (this.advancedFilters.report_date_end) {
        tempReports = tempReports.filter(report =>
          report.report_date <= this.advancedFilters.report_date_end
        );
      }
      if (this.advancedFilters.made_by) {
        tempReports = tempReports.filter(report =>
          report.made_by.toLowerCase().includes(this.advancedFilters.made_by.toLowerCase())
        );
      }
      if (this.advancedFilters.comment) {
        tempReports = tempReports.filter(report =>
          report.comment.toLowerCase().includes(this.advancedFilters.comment.toLowerCase())
        );
      }
    }

    this.filteredReports = tempReports; // Actualiza la lista de reportes mostrados
  }

  /**
   * @description Reinicia los filtros avanzados a sus valores por defecto y aplica los filtros.
   */
  public resetAdvancedFilter(): void {
    this.advancedFilters = {
      report_date_start: '',
      report_date_end: '',
      made_by: '',
      comment: ''
    };
    // También se puede resetear el campo de fecha de Materialize si es necesario
    const datepickerElements = document.querySelectorAll('.datepicker');
    datepickerElements.forEach(el => {
      const instance = M.Datepicker.getInstance(el);
      if (instance) {
        instance.setDate(new Date()); // O setDate(null) para limpiar si Materialize lo permite
        (el as HTMLInputElement).value = ''; // Limpiar visualmente el input
      }
    });

    this.applyFilters(); // Aplica los filtros después de resetear
  }

  /**
   * @description Maneja el evento de cambio en el campo de búsqueda normal.
   * @param event Evento de entrada.
   */
  public onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }
}