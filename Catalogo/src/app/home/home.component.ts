import { Component, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  headers: any = new Headers({ 'Content-Type': 'application/json' });
  options: any = new RequestOptions({ headers: this.headers });
  urlCourse: any = '/v1/courses';
  urlTeacher: any = '/v1/teachers';
  teachers: any[] = [];
  courses: any[] = [];


  constructor(private http: Http) {
    this.http.get(this.urlCourse).subscribe((course) => {
      this.courses = course.json();
    }, error => {
      console.log(error);
    });
    this.http.get(this.urlTeacher).subscribe((teacher) => {
      this.teachers = teacher.json();
    }, error => {
      console.log(error);
    });

  }

  ngOnInit() {
  }



}
