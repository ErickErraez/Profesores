import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { ImagenService } from '../services/imagen.service';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent {

  imageChangedEvent: any = '';
  public respuestaImagenEnviada;
  public resultadoCarga;
  course: any = [];
  idSocialMedia: any;
  id: any = null;
  valueText: any = '';
  urlTeacher: any = '/v1/teachers/';
  teacher: any = {};
  teacherPost: any = {};
  red: any = [];
  urlRedes: any = '/v1/socialMedias';
  IdCreado: any;
  imageNewUser: any;
  value: any;

  // tslint:disable-next-line:max-line-length
  constructor(private toastr: ToastrService, private router: Router, private root: ActivatedRoute, private http: Http, private servicio: ImagenService) {

    this.id = this.root.snapshot.params['id'];
    if (this.id !== 'new') {
      console.log(this.id);
      this.http.get(this.urlTeacher + this.id).subscribe((data) => {
        this.teacher = data.json();
        console.log(this.teacher);
        this.toastr.success(this.teacher.name, 'Bienvenido');
      }, error => {
        console.log(error);
      });
    } else {
      this.toastr.success('Formulario De Ingreso de Profesor', 'Bienvenido');
    }
    this.http.get(this.urlRedes).subscribe((redes) => {
      this.red = redes.json();
    }, error => {
      console.log(error);
    });

    this.http.get('v1/courses').subscribe((course) => {
      this.course = course.json();
      console.log(this.course);
    });
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

  showSuccess(teacherName) {
    this.toastr.success('Guardado con exito!', 'Profesor ' + teacherName + '!');
  }

  guardarProfesor() {

    this.value = document.getElementsByName('social')[0];
    this.value.text = '';
    this.value = document.getElementsByName('social')[0];
    if (this.id === 'new') {
      if (this.teacher.name === undefined) {
        this.toastr.error('Primero debes llenar tu Nombre', 'Ocurrio un Error');
      } else {
        this.teacherPost = {
          name: this.teacher.name,
          avatar: 'null'
        };
        this.http.post(this.urlTeacher, this.teacherPost).subscribe((result) => {
          console.log(result);
          if (result.statusText === 'No Content') {
            this.toastr.error('El Profesor ' + this.teacher.name + ' ya existe', 'Ocurrio un Error');
          } else {
            // tslint:disable-next-line:radix
            this.IdCreado = (parseInt(Object.values(result)[0]));
            if (this.value.text !== undefined && this.valueText !== '') {
              this.teacher = { // tslint:disable-next-line:radix
                idTeacher: this.IdCreado,
                name: this.teacherPost.name,
                teacherSocialMedias: [{
                  nickname: this.valueText,
                  socialMedia: {
                    idSocialMedia: this.teacher.idTeacherSocialMedia
                  }
                }]
              };
              if (this.imageNewUser !== undefined && this.valueText !== '' && this.value.text !== undefined) {
                console.log(this.imageNewUser);
                this.servicio.postFileImagen(this.imageNewUser, this.IdCreado).subscribe(response => {
                  this.respuestaImagenEnviada = response;
                  console.log(this.respuestaImagenEnviada);
                  this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
                  this.showSuccess(this.teacher.name);
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
                this.http.put('/v1/teachers/socialMedias', this.teacher).subscribe(Response => {
                  if (Response.statusText === 'No Content') {
                    this.toastr.error('La Red Social ' + this.valueText + ' ya existe', 'Ocurrio un Error');
                  } else {
                    this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
                    this.showSuccess(this.teacher.name);
                    setTimeout(function () { location.reload(true); }, 2000);
                  }
                });
              }
              if (this.valueText !== '' && this.value.text !== undefined && this.imageNewUser === undefined) {
                this.http.put('/v1/teachers/socialMedias', this.teacher).subscribe(Response => {
                  if (Response.statusText === 'No Content') {
                    this.toastr.error('La Red Social ' + this.valueText + ' ya existe', 'Ocurrio un Error');
                  } else {
                    this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
                    this.showSuccess(this.teacher.name);
                    setTimeout(function () { location.reload(true); }, 2000);
                  }
                });
              }
            }
          }
        }, error => {
          console.log(error);
        });
      }
    } else {

      if (this.teacher.name === undefined) {
        this.toastr.error('Ocurrio un Error', 'Primero debes llenar tu Nombre');
      } else {

        this.teacher = {
          idTeacher: this.teacher.idTeacher,
          name: this.teacher.name,
          teacherSocialMedias: [
            {
              nickname: this.valueText,
              socialMedia: {
                idSocialMedia: this.teacher.idTeacherSocialMedia
              }
            }
          ]
        };

        if (this.imageNewUser !== undefined && this.valueText !== '' && this.value.text !== undefined) {
          this.servicio.postFileImagen(this.imageNewUser, this.teacher.idTeacher).subscribe(response => {
            this.respuestaImagenEnviada = response;
            console.log(this.respuestaImagenEnviada);
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
          this.http.put('/v1/teachers/socialMedias', this.teacher).subscribe(Response => {
            if (Response.statusText === 'No Content') {
              this.toastr.error('La Red Social ' + this.valueText + ' ya existe', 'Ocurrio un Error');
            } else {
              this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
              this.showSuccess(this.teacher.name);
              setTimeout(function () { location.reload(true); }, 2000);
            }
          });
        }
        if (this.valueText !== '' && this.value.text !== undefined && this.imageNewUser === undefined) {
          this.http.put('/v1/teachers/socialMedias', this.teacher).subscribe(Response => {
            if (Response.statusText === 'No Content') {
              this.toastr.error('La Red Social ' + this.valueText + ' ya existe', 'Ocurrio un Error');
            } else {
              this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
              this.showSuccess(this.teacher.name);
              setTimeout(function () { location.reload(true); }, 2000);
            }
          });
        }
        if (this.imageNewUser !== undefined && this.valueText !== '') {
          this.servicio.postFileImagen(this.imageNewUser, this.teacher.idTeacher).subscribe(response => {
            this.respuestaImagenEnviada = response;
            this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
            this.showSuccess(this.teacher.name);
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

      }
    }
  }
}

