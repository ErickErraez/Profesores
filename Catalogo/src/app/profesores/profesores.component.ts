import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';

@Component({
  selector: 'app-profesores',
  templateUrl: './profesores.component.html',
  styleUrls: ['./profesores.component.css']
})
export class ProfesoresComponent implements OnInit {

  imageChangedEvent: any = '';
  croppedImage: any = '';
  id: any = null;
  urlTeacher: any = '/v1/teachers/';
  teacher: any = {};
  red: any = {};
  urlRedes: any = '/v1/socialMedias';


  constructor(private modalService: NgbModal, private root: ActivatedRoute, private http: Http) {
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
      console.log(this.red);
    }, error => {
      console.log(error);
    });

  }

  ngOnInit() {

  }

  fileChangeEvent(event: any, content: any): void {
    this.imageChangedEvent = event;
    this.open(content);
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

}
