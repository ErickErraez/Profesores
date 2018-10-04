import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private angularFireAuth: AngularFireAuth, private toastr: ToastrService) {
    this.getStatus();
  }

  getStatus() {
    return this.angularFireAuth.authState; // se comunica con firebase y trae el objeto de sesion de firebase
  }

  loginWithEmail(emai: string, password: string) {
    if (emai == null) {
      this.toastr.error('Falta el Email!', 'Ocurrio un Error!');

    } else if (password == null) {
      this.toastr.error('Falta la Contraseña!', 'Ocurrio un Error!');

    } else {
      return this.angularFireAuth.auth.signInWithEmailAndPassword(emai, password);
    }
  }
  registerWithEmail(emai: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(emai, password);
  }

  logOut() {
    return this.angularFireAuth.auth.signOut();
  }

  getUser() {
    return this.angularFireAuth.auth;
  }
}
