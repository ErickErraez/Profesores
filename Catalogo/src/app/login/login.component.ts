import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = null;
  password: string = null;

  constructor(private toastr: ToastrService, private authenticacion: AuthenticationService, private router: Router) {

  }

  login() {
    if (this.email === null || this.password === null) {
      this.toastr.error('Faltan Usuario o Contraseña', 'Ocurrio un error!');
    } else {
      this.authenticacion.loginWithEmail(this.email, this.password).then((data) => {
        this.router.navigate(['home']);
      }).catch((error) => {
        console.log(error);
        if (error.code === 'auth/user-not-found') {
          this.toastr.error('El Usuario no existe', 'Ocurrio un error!');
        } else if (error.code === 'auth/wrong-password') {
          this.toastr.error('La contraseña es Incorrecta', 'Ocurrio un error!');
        } else if (error.code === 'auth/invalid-email') {
          this.toastr.error('Ingresa un email valido', 'Ocurrio un error!');
        }

      });
    }
  }

}
