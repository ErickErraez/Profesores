import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  public url_servidor = '/v1/courses/icons';

  constructor(private http: Http) { }

  public postFileImagen(imagenParaSubir: File, id) {

    const formData = new FormData();
    formData.append('id_course', id);
    formData.append('icon', imagenParaSubir);
    return this.http.post(this.url_servidor, formData);

  }
}
