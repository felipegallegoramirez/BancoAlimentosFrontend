// admon-logsalert.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { LogsAlert } from '../../models/logs_alert.model'; 
import { LogsAlertsService } from '../../services/logs-alerts.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-logsalert',
  templateUrl: './logsalert.component.html',
  styleUrls: ['./logsalert.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LogsalertComponent implements OnInit {
  dataSource: MatTableDataSource<LogsAlert>;
  displayedColumns: string[] = ['id_log', 'subcategory_name', 'product', 'alert_date', 'alert_type'];
  expandedElement: LogsAlert | null;
  logsAlerts: LogsAlert[] = [];
  filterForm: FormGroup;
  advancedFilterForm: FormGroup;
  showAdvancedFilter = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private logsAlertService: LogsAlertsService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchTerm: ['']
    });
    this.advancedFilterForm = this.fb.group({
      id_log: [''],
      subcategory_name: [''],
      product: [''],
      alert_date_start: [''],
      alert_date_end: [''],
      alert_type: ['']
    });
  }

  ngOnInit(): void {
    this.loadLogsAlerts();

    this.filterForm.get('searchTerm').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.applyFilter(searchTerm);
    });

    this.advancedFilterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(() => {
      this.applyAdvancedFilter();
    });
  }

  loadLogsAlerts(): void {
    this.logsAlertService.getLogsAlerts().then(
      (data: any) => {
        console.log(data);
        this.logsAlerts = data;
        this.dataSource = new MatTableDataSource(this.logsAlerts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error loading logs alerts', error);
      }
    );
  }

  applyFilter(searchTerm: string): void {
    if (this.showAdvancedFilter) {
      // If advanced filter is active, normal search should not override it
      return;
    }
    const filterValue = searchTerm.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleAdvancedFilter(): void {
    this.showAdvancedFilter = !this.showAdvancedFilter;
    if (!this.showAdvancedFilter) {
      this.advancedFilterForm.reset();
      this.loadLogsAlerts(); // Reload all data when advanced filter is closed
    }
  }

  applyAdvancedFilter(): void {
    let filteredData = [...this.logsAlerts]; // Start with the full dataset

    const formValues = this.advancedFilterForm.value;

    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      if (value) {
        if (key === 'alert_date_start') {
          const startDate = new Date(value);
          filteredData = filteredData.filter(log => log.alert_date && new Date(log.alert_date) >= startDate);
        } else if (key === 'alert_date_end') {
          const endDate = new Date(value);
          filteredData = filteredData.filter(log => log.alert_date && new Date(log.alert_date) <= endDate);
        } else if (typeof value === 'string') {
          filteredData = filteredData.filter(log =>
            log[key] && log[key].toString().toLowerCase().includes(value.toLowerCase())
          );
        } else if (typeof value === 'number') {
          filteredData = filteredData.filter(log =>
            log[key] && log[key] === value
          );
        }
      }
    });

    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearNormalFilter(): void {
    this.filterForm.get('searchTerm').setValue('');
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearAdvancedFilter(): void {
    this.advancedFilterForm.reset();
    this.loadLogsAlerts(); // Reload all data after clearing advanced filter
  }
}