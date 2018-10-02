import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ToastrService } from 'ngx-toastr';
import { ImagenService } from '../services/imagen.service';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit {

  imageChangedEvent: any = '';
  public respuestaImagenEnviada;
  public resultadoCarga;
  croppedImage: any = '';
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
      }, error => {
        console.log(error);
      });
    }
    this.http.get(this.urlRedes).subscribe((redes) => {
      this.red = redes.json();
    }, error => {
      console.log(error);
    });

  }

  ngOnInit() {

  }

  reFresh() {
    location.reload(true);
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

  sendValor(prueba) {
    this.valueText = prueba;
  }

  fileChangeEvent(content: any): void {
    this.imageChangedEvent = event;

  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

  guardarProfesor() {

    this.value = document.getElementsByName('social')[0];
    console.log(this.value.text);
    console.log(this.imageNewUser);
    if (this.id === 'new') {
      if (this.teacher.name === undefined) {
        this.toastr.success('Primero debes llenar tu Nombre', 'Ocurrio un Error');
      } else {
        this.teacherPost = {
          name: this.teacher.name,
          avatar: 'null'
        };

        this.http.post(this.urlTeacher, this.teacherPost).subscribe((result) => {
          // tslint:disable-next-line:radix
          this.IdCreado = (parseInt(Object.values(result)[0]));

          if (this.value.text !== undefined && this.valueText !== '') {
            this.teacher = { // tslint:disable-next-line:radix
              idTeacher: parseInt(this.IdCreado),
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
                this.toastr.success('Guardado con exito!', 'Profesor ' + this.teacher.name + '!');
                window.setInterval(this.reFresh(), 1000);

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
                this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
                this.toastr.success('Guardado con exito!', 'Profesor ' + this.teacher.name + '!');
                window.setInterval(this.reFresh(), 1000);
              });
            }
            if (this.valueText !== '' && this.value.text !== undefined && this.imageNewUser === undefined) {
              this.http.put('/v1/teachers/socialMedias', this.teacher).subscribe(Response => {
                this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
                this.toastr.success('Guardado con exito!', 'Profesor ' + this.teacher.name + '!');
                window.setInterval(this.reFresh(), 1000);
              });

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

            this.toastr.success('Guardado con exito!', 'Profesor ' + this.teacher.name + '!');
            this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
            window.setInterval(this.reFresh(), 1000);
          });
        }
        if (this.valueText !== '' && this.value.text !== undefined && this.imageNewUser === undefined) {
          this.http.put('/v1/teachers/socialMedias', this.teacher).subscribe(Response => {

            this.toastr.success('Guardado con exito!', 'Profesor ' + this.teacher.name + '!');
            this.router.navigate(['/profesores/' + this.teacher.idTeacher]);
            window.setInterval(this.reFresh(), 1000);
          });
        }
        if (this.imageNewUser !== undefined) {

          this.servicio.postFileImagen(this.imageNewUser, this.teacher.idTeacher).subscribe(response => {
            this.respuestaImagenEnviada = response;
            this.router.navigate(['/profesores/' + this.teacher.idTeacher]);

            this.toastr.success('Guardado con exito!', 'Profesor ' + this.teacher.name + '!', { timeOut: 3000 });
            window.setInterval(this.reFresh(), 9000);


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

