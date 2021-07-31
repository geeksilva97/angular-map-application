import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Municipio } from 'src/models/municipio.interface';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class IbgeService {

  geocoder: any;

  constructor(
    private http: HttpClient
  ) {
    this.geocoder = new google.maps.Geocoder();
  }

  citiesByState(): Observable<Municipio[]> {
    // const URL = encodeURI('https://servicodados.ibge.gov.br/api/v1/localidades/estados/42|41|35|33|51|31/municipios');
    const URL = encodeURI('https://servicodados.ibge.gov.br/api/v1/localidades/municipios/');
    return this.http.get(URL, {
      observe: 'body'
    }).pipe(
      map((municipios: any[]) => {
        return municipios.map(municipio => municipio as Municipio)
      })
    );
  }

  async geocodeAddress(address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") resolve(results);
        reject(status);
      });
    });
  }
}
