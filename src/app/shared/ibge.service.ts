import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Municipio } from 'src/models/municipio.interface';

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  constructor(
    private http: HttpClient
  ) { }

  citiesByState(): Observable<Municipio[]> {
    return this.http.get(encodeURI('https://servicodados.ibge.gov.br/api/v1/localidades/estados/42/municipios'), {
      // return this.http.get(encodeURI('https://servicodados.ibge.gov.br/api/v1/localidades/estados/42|41|33|51|31/municipios'), {
      observe: 'body'
    }).pipe(
      map((municipios: any[]) => {
        return municipios.map(municipio => municipio as Municipio)
      })
    );
  }
}
