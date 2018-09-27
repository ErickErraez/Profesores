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
  social: any;
  teachers: any[] = [];
  courses: any[] = [];


  constructor(private http: Http) {
    this.http.get(this.urlCourse).subscribe((course) => {
      // console.log(course.json());
      this.courses = course.json();
    }, error => {
      console.log(error);
    });
    this.http.get(this.urlTeacher).subscribe((teacher) => {
      console.log(teacher.json());
      this.teachers = teacher.json();
      for (let i = 0; i < 1; i++) {
        for (let j = 0; j < teacher.json()[i].teacherSocialMedias.length; j++) {
          this.social = teacher.json()[j].teacherSocialMedias;

        }
      }
      console.log(this.social);
      debugger;
    }, error => {
      console.log(error);
    });

  }

  ngOnInit() {

  }

}
