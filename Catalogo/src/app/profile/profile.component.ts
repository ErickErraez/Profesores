import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  id: any = null;
  users: any = [];
  user: any = {};
  esVisibleVentanaEdicion: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(private modalService: NgbModal, private userServices: UserService, private rooter: Router, private root: ActivatedRoute, private toastr: ToastrService) {
    this.userServices.getUsers().valueChanges().subscribe((data) => {
      this.users = data;
    }, (error) => {
      console.log(error);
    });

  }

  ngOnInit() {
  }

  guardar() {
    console.log(this.user);
    if (this.user.uid === undefined) {
      this.toastr.error('No hay datos seleccionados para editar', 'Ocurrio un error!');
    } else {
      this.userServices.editUser(this.user);
      this.toastr.success('Fue Modificado con Exito', 'El Usuario ' + this.user.name);
    }
  }

  open(content) {
    this.modalService.open(content).result.then((result => {
      console.log(content);
      if (result === 'save') {
        this.guardar();
      }
    }), (result => {

    }));
  }


  estaSeleccionado(porVerificar): boolean {
    if (this.user == null) {
      return false;
    }
    return porVerificar.uid === this.user.uid;
  }

  onSelect(actual): void {
    this.user = actual;
  }

  refresh(): void {
    this.userServices.getUsers().valueChanges().subscribe((data) => {
      this.users = data;
    }, (error) => {
      console.log(error);
    });
  }

}
