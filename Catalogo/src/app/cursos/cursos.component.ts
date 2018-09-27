import { Component, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
  guardarLugar() {
    const curso1 = {
      id: Date.now(),
      temario: 'Prueba1 \nPrueba3',
      proyecto: 'Platzinger'
    };

  }

}
