import { Component, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('animable', [
      state('inicial', style({
        opacity: 0
      })),
      state('final', style({
        opacity: 1
      })),
      transition('inicial => final', animate(3000)),
      transition('final => inicial', animate(2500)),
    ])
  ]
})
export class HomeComponent implements OnInit {

  headers: any = new Headers({ 'Content-Type': 'application/json' });
  options: any = new RequestOptions({ headers: this.headers });
  urlCourse: any = '/v1/courses';
  urlTeacher: any = '/v1/teachers';
  teachers: any[] = [];
  courses: any = [];
  idTeacherOfCurso: any;
  state = 'inicial';
  loggedIn = false;
  logUser: any = null;
  user: any = {};


  constructor(private toastr: ToastrService, private authenticacion: AuthenticationService, private http: Http,
    private userServices: UserService) {
    this.getUserIfExits();
    this.getAllData();
  }

  start(e) {

    console.log('Iniciado!');
    console.log(e);
  }

  finish(e) {
    console.log('Terminado!');
    console.log(e);
  }

  ngOnInit() {

  }
  getAllData() {
    this.http.get(this.urlCourse).subscribe((course) => {
      this.courses = course.json();
      this.state = 'final';
    }, error => {
      console.log(error);
    });
    this.http.get(this.urlTeacher).subscribe((teacher) => {
      this.teachers = teacher.json();
    }, error => {
      console.log(error);
    });

  }
  getUserIfExits() {
    this.authenticacion.getStatus().subscribe((response) => {
      if (response && response.uid) {
        this.loggedIn = true;
        setTimeout(() => {
          this.logUser = this.authenticacion.getUser().currentUser.email;
        }, 500);
        this.userServices.getUsersById(response.uid).valueChanges().subscribe((data) => {
          this.user = data;
          this.toastr.success(this.user.name + ' al Sistema', 'Bienvenido');
        });
      } else {
        this.loggedIn = false;
        this.toastr.success('Bienvenido al sistema');
      }
    }, (error) => {
      this.loggedIn = false;
    });
  }

}
