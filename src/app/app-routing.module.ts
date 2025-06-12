import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './pages/login/login.component';
import { EntryComponent } from './pages/entry/entry.component';
import { ExitComponent } from './pages/exit/exit.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { AdmonComponent } from './pages/admon/admon.component';
import { HomeComponent } from './pages/home/home.component';
import { ReportComponent } from './pages/report/report.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { CategoryComponent } from './pages/category/category.component';
import { RoleComponent } from './pages/role/role.component';
import { LogsalertComponent } from './pages/logsalert/logsalert.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'entry', component: EntryComponent },
  { path: 'exit', component: ExitComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'admon', component: AdmonComponent },
  { path: 'home', component: HomeComponent },
  { path: 'report', component: ReportComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'role', component: RoleComponent },
  { path: 'logsalert', component: LogsalertComponent },
  { path: '**', redirectTo: 'landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



