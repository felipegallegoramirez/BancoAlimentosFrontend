import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  token: string = '';
  constructor (private userservice: UserService, private router: Router){}
  onLogin() {
    this.userservice.login(this.email, this.password).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('id', res.user.id_user);
        this.router.navigate(['/inventory']);
      },
      (err) => {
        alert('Usuario o contraseña incorrectos');
        console.log(err);
      }
    );
  }
}
