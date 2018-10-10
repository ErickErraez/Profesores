import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IconService } from '../services/icon.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent {

  id: any = null;
  urlCourse: any = '/v1/courses/';
  course: any = {};
  respuestaImagenEnviada;
  resultadoCarga;
  IdCreado: any;
  imageNewUser: any;

  constructor(private toastr: ToastrService, private http: Http, private iconService: IconService,
    private router: Router, private root: ActivatedRoute) {

    this.id = this.root.snapshot.params['id'];
    if (this.id !== 'new') {
      console.log(this.id);
      this.http.get(this.urlCourse + this.id).subscribe((data) => {
        this.course = data.json();
        console.log(this.course);
      }, error => {
        console.log(error);
      });
    } else {
      this.toastr.success('Formulario De Ingreso de Profesor', 'Bienvenido');
    }
  }

  showSuccess(course) {
    this.toastr.success('Fue Guardado con exito!', 'El curso ' + course + '!');
  }

  showError(course) {
    this.toastr.error('No Pudo Guardarse!', ' El Curso ' + course + '!');
  }

  public cargandoImagen(files: FileList) {
    if (this.id === 'new') {
      this.imageNewUser = files[0];
      console.log(this.imageNewUser);
    } else {
      this.imageNewUser = files[0];
      console.log(this.imageNewUser);
    }
  }

  guardarCurso() {

    this.course = {
      idCourse: this.course.idCourse,
      name: this.course.name,
      themes: this.course.themes,
      project: this.course.project
    };

    if (this.id === 'new') {
      if (this.course.name === undefined || this.course.themes === undefined || this.course.project === undefined) {
        this.toastr.error('Faltan datos del Curso', 'Ocurrio un Error!');
      } else {
        this.course = {
          name: this.course.name,
          themes: this.course.themes,
          project: this.course.project,
          icon: 'null'
        };
        this.http.post(this.urlCourse, this.course).subscribe((response) => {
          console.log(response);
          // tslint:disable-next-line:radix
          this.IdCreado = (parseInt(Object.values(response)[0]));
          this.iconService.postFileImagen(this.imageNewUser, this.IdCreado).subscribe(data => {
            this.respuestaImagenEnviada = response;
            console.log(this.respuestaImagenEnviada);
            this.router.navigate(['/cursos/' + this.id]);
            this.showSuccess(this.course.name);
            setTimeout(function () { location.reload(true); }, 2000);
            if (this.respuestaImagenEnviada <= 1) {
              console.log('Error en el servidor');
            } else {
              if (this.respuestaImagenEnviada.code === 200 && this.respuestaImagenEnviada.status === 'success') {
                this.resultadoCarga = 1;
              } else {
                this.resultadoCarga = 2;
              }
            }

          }, error => {
            console.log(<any>error);
          });
        }, (error) => {
          if (error.statusText !== 'Conflict') {
            this.showError(this.course.name);
            setTimeout(function () { location.reload(true); }, 2000);
          } else {
            this.toastr.error('El Curso ' + this.course.name + ' ya existe', 'Ocurrio un Error!');
          }
        });
      }

    } else {

      if (this.course.name === undefined || this.course.themes === undefined || this.course.project === undefined) {
        this.toastr.error('Faltan datos del Curso', 'Ocurrio un Error!');
      } else {
        this.http.patch(this.urlCourse + this.id, this.course).subscribe((response) => {
          console.log(this.course.icon);
          if (this.course.icon !== 'null' && this.imageNewUser !== undefined) {

            this.iconService.postFileImagen(this.imageNewUser, this.id).subscribe(data => {
              this.respuestaImagenEnviada = response;
              console.log(this.respuestaImagenEnviada);
              this.router.navigate(['/cursos/' + this.id]);
              this.showSuccess(this.course.name);
              setTimeout(function () { location.reload(true); }, 2000);
              if (this.respuestaImagenEnviada <= 1) {
                console.log('Error en el servidor');
              } else {
                if (this.respuestaImagenEnviada.code === 200 && this.respuestaImagenEnviada.status === 'success') {
                  this.resultadoCarga = 1;
                } else {
                  this.resultadoCarga = 2;
                }
              }

            }, error => {
              console.log(<any>error);
            });

          }

        }, (error) => {
          this.showError(this.course.name);
          setTimeout(function () { location.reload(true); }, 3000);
        });
      }

    }

  }

}
