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
import { DonorComponent } from './pages/donor/donor.component';
import { BeneficiaryComponent } from './pages/beneficiary/beneficiary.component';
import { ExitlistComponent } from './pages/exitlist/exitlist.component';
import { EmailComponent } from './pages/email/email.component';


import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'entry', component: EntryComponent, canActivate: [AuthGuard] },
  { path: 'exit', component: ExitComponent, canActivate: [AuthGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
  { path: 'admon', component: AdmonComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'supplier', component: SupplierComponent, canActivate: [AuthGuard] },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'role', component: RoleComponent, canActivate: [AuthGuard] },
  { path: 'logsalert', component: LogsalertComponent, canActivate: [AuthGuard] },
  { path: 'donor', component: DonorComponent, canActivate: [AuthGuard] },
  { path: 'beneficiary', component: BeneficiaryComponent, canActivate: [AuthGuard] },
  { path: 'exitlist', component: ExitlistComponent, canActivate: [AuthGuard] },
  { path: 'email', component: EmailComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: 'landing' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



