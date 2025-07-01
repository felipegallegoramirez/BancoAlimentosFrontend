import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
declare var M: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
  }
  
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}