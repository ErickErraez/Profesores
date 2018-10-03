import { Component } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
export class HomeComponent {

  headers: any = new Headers({ 'Content-Type': 'application/json' });
  options: any = new RequestOptions({ headers: this.headers });
  urlCourse: any = '/v1/courses';
  urlTeacher: any = '/v1/teachers';
  teachers: any[] = [];
  courses: any[] = [];
  state = 'inicial';


  constructor(private http: Http) {


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
  start(e) {

    console.log('Iniciado!');
    console.log(e);
  }

  finish(e) {
    console.log('Terminado!');
    console.log(e);
  }

}
