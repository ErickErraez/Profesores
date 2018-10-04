import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFireDatabase: AngularFireDatabase) {

  }

  getUsers() {
    return this.angularFireDatabase.list('/users');
  }
  getUsersById(uid) {
    return this.angularFireDatabase.object('/users/' + uid);
  }

  createrUser(user) {
    return this.angularFireDatabase.object('/users/' + user.uid).set(user);
  }
  editUser(user) {
    return this.angularFireDatabase.object('/users/' + user.uid).set(user);
  }

}
