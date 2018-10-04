import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loggedIn = false;
  user: any = {};
  logUser: any = null;

  constructor(private toastr: ToastrService, private autorizacionService: AuthenticationService, private userServices: UserService) {
    this.autorizacionService.getStatus().subscribe((response) => {
      if (response && response.uid) {
        this.loggedIn = true;
        setTimeout(() => {
          this.logUser = this.autorizacionService.getUser().currentUser.email;
        }, 500);
        this.userServices.getUsersById(response.uid).valueChanges().subscribe((data) => {
          this.user = data;
          console.log(this.user);
        });
      } else {
        this.loggedIn = false;
      }
    }, (error) => {
      this.loggedIn = false;
    });

  }

  logout() {
    this.autorizacionService.logOut();
  }

}
