import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {

  loggedIn = false;
  logUser: any = null;
  user: any = {};

  constructor(private autorizacionService: AuthenticationService, private userServices: UserService, private router: Router) {
    this.autorizacionService.getStatus().subscribe((response) => {
      if (response && response.uid) {
        setTimeout(() => {
          this.logUser = this.autorizacionService.getUser().currentUser.email;
        }, 500);
        this.userServices.getUsersById(response.uid).valueChanges().subscribe((data) => {
          this.user = data;
          if (this.user.rol === 'Profesor' || this.user.rol === 'Admin') {
            this.loggedIn = true;
          } else {
            this.loggedIn = false;
          }
        });
      } else {
        this.loggedIn = false;
      }
    }, (error) => {
      this.loggedIn = false;
    });
  }

  canActivate() {
    if (this.loggedIn === false) {
      this.router.navigate(['home']);
      setTimeout(function () { return this.loggedIn; }, 2000);
    } else {
      return this.loggedIn;
    }
  }
}
