import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
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
  red: any = [];
  urlRedes: any = '/v1/socialMedias';

  // tslint:disable-next-line:max-line-length
  constructor(private modalService: NgbModal, private router: Router, private root: ActivatedRoute, private http: Http, private servicio: ImagenService) {

    this.id = this.root.snapshot.params['id'];
    console.log(this.id);
    this.http.get(this.urlTeacher + this.id).subscribe((data) => {
      this.teacher = data.json();
      console.log(this.teacher);
    }, error => {
      console.log(error);
    });
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

    this.servicio.postFileImagen(files[0], this.teacher.idTeacher).subscribe(

      response => {
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
      },
      error => {
        console.log(<any>error);
      }

    );
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

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {

    }, (reason) => {

    });
  }
  Warning() {
    alert('Recuerde este sera su nombre no se podra cambiar');
  }

  guardarProfesor() {

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

    console.log(this.teacher.name);
    this.http.put('/v1/teachers/socialMedias', this.teacher)
      .subscribe(Response => {

        console.log('-------------');
        console.log(this.teacher.name);
        //window.setInterval(this.reFresh(), 1000);

      });

    /*
        "idTeacher": 4,
        "teacherSocialMedias":
        [
          {
            "nickname": "@pepe",
            "socialMedia": {
              "idSocialMedia": 4
             }
          }
        ]
    */




  }

}
