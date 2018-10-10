import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loggedIn = false;
  prueba: any = '';
  userSelected: any = [];
  user: any = {};
  logUser: any = null;

  // tslint:disable-next-line:max-line-length
  constructor(private rooter: Router, private modalService: NgbModal, private toastr: ToastrService, private autorizacionService: AuthenticationService, private userServices: UserService) {
    this.autorizacionService.getStatus().subscribe((response) => {
      if (response && response.uid) {
        this.loggedIn = true;
        setTimeout(() => {
          this.logUser = this.autorizacionService.getUser().currentUser.email;
        }, 500);
        this.userServices.getUsersById(response.uid).valueChanges().subscribe((data) => {
          this.user = data;
        });
      } else {
        this.loggedIn = false;
      }
    }, (error) => {
      this.loggedIn = false;
    });
    console.log(this.user);
  }

  logout() {
    this.autorizacionService.logOut();
    this.rooter.navigate(['home']);
    this.loggedIn = false;
    this.user = {};
  }
}

