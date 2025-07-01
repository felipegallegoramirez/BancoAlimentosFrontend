import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { NgxBarcodeScannerModule } from '@eisberg-labs/ngx-barcode-scanner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './pages/login/login.component';
import { EntryComponent } from './pages/entry/entry.component';
import { ExitComponent } from './pages/exit/exit.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { AdmonComponent } from './pages/admon/admon.component';
import { HomeComponent } from './pages/home/home.component';
import { ReportComponent } from './pages/report/report.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RoleService } from './services/role.service';
import { EmailService } from './services/email.service';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MaterializeSelectDirective } from './directives/materialize-select.directive';
import { CategoryComponent } from './pages/category/category.component';
import { RoleComponent } from './pages/role/role.component';
import { LogsalertComponent } from './pages/logsalert/logsalert.component';
import { BeneficiaryComponent } from './pages/beneficiary/beneficiary.component';
import { DonorComponent } from './pages/donor/donor.component';
import { ExitlistComponent } from './pages/exitlist/exitlist.component';
import { EmailComponent } from './pages/email/email.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EntryComponent,
    ExitComponent,
    InventoryComponent,
    AdmonComponent,
    HomeComponent,
    ReportComponent,
    SupplierComponent,
    MaterializeSelectDirective,
    CategoryComponent,
    RoleComponent,
    LogsalertComponent,
    BeneficiaryComponent,
    DonorComponent,
    ExitlistComponent,
    EmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonToggleModule,  
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    NgxBarcodeScannerModule,
    MatIconModule,
  ],
  providers: [
    provideAnimationsAsync(),
    RoleService,
    EmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
