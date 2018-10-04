import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { User } from 'firebase';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  registro: any = {};
  email: string = null;
  password: string = null;
  name: string = null;
  repPassword: string = null;
  rol: string = null;
  constructor(private authServices: AuthenticationService, private toastr: ToastrService,
    private userServices: UserService, private router: Router) {

  }

  register() {
    if (this.email === null || this.password === null || this.name === null || this.rol === null) {
      this.toastr.error('Faltan Datos para Registrarse!', 'Ocurrio un error!');
    } else {
      if (this.password !== this.repPassword) {
        this.toastr.error('Las Contraseñas no coinciden!', 'Ocurrio un error!');
      } else {
        if (this.password.length < 6 || this.repPassword.length < 6) {
          this.toastr.error('La Contraseña debe ser mayor a 6 digitos!', 'Ocurrio un error!');
        } else {
          this.authServices.registerWithEmail(this.email, this.password).then((data) => {
            const user = {
              uid: data.user.uid,
              email: this.email,
              name: this.name,
              rol: this.rol
            };
            this.userServices.createrUser(user).then((response) => {
              this.toastr.success('Fue Registrado Correctamente!', 'El Usuario: ' + this.name);
              this.router.navigate(['home']);
            }).catch((error) => {
              console.log(error);
              this.toastr.error('Ocurrio un error!');
            });
          }).catch((error) => {
            console.log(error);
            if (error.code === 'auth/email-already-in-use') {
              this.toastr.error('El correo ya existe', 'Ocurrio un error!');
            }
          });
        }
      }
    }
  }
}
