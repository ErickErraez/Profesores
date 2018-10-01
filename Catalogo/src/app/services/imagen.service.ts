import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  public url_servidor = '/v1/teachers/images';

  constructor(private http: Http) { }

  public postFileImagen(imagenParaSubir: File, id) {

    const formData = new FormData();
    formData.append('id_teacher', id);
    formData.append('file', imagenParaSubir);
    return this.http.post(this.url_servidor, formData);

  }

}
