import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, tap, filter, debounceTime } from 'rxjs/operators';
import { Airship } from 'src/models/airship.interface';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment';
import { IbgeService } from 'src/app/shared/ibge.service';
import { Municipio } from 'src/models/municipio.interface';


declare var google: any;

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit {


  from: any;
  to: any;

  map: any;

  isLoading: boolean = false;
  step: number = 0;

  directionsRenderer: any;
  directionsService: any;
  polylineAirship: any;

  statusDriving = {
    duration: '',
    distance: 0
  };

  statusFlying = {
    duration: '',
    countFuel: 0,
    distance: 0
  };

  places = [
    {
      description: 'Curitiba',
      position: {
        lat: -25.439566808109237, lng: -49.27985305911108
      }
    },

    {
      description: 'São Paulo',
      position: {
        lat: -23.511362424163533, lng: -46.661443530420094
      }
    }
  ];
  selectedAirship: Airship;
  airships: Airship[] = [
    {
      name: 'Airbus H125',
      maximumSpeed: 287,
      fastCruiseSpeed: 260,
      range: 640,
      endurance: 15600
    },

    {
      name: 'Airbus H130',
      maximumSpeed: 287,
      fastCruiseSpeed: 235,
      range: 610,
      endurance: 14400
    },

    {
      name: 'Bell 505',
      maximumSpeed: 270,
      fastCruiseSpeed: 231,
      range: 566,
      endurance: 14400
    },


    {
      name: 'Bell 407',
      maximumSpeed: 270,
      fastCruiseSpeed: 246,
      range: 624,
      endurance: 14400
    },

    {
      name: 'Robinson R66 - Turbine',
      maximumSpeed: 260,
      fastCruiseSpeed: 200,
      range: 630,
      endurance: 10800
    },

    {
      name: 'Robinson R44 - Raven II',
      maximumSpeed: 240,
      fastCruiseSpeed: 200,
      range: 560,
      endurance: 10800
    }
  ];

  locationFromControl = new FormControl();
  locationToControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptionsFrom: Observable<Municipio[]>;
  filteredOptionsTo: Observable<Municipio[]>;

  municipios: Municipio[] = [];

  constructor(
    private _snackBar: MatSnackBar,
    private ibgeService: IbgeService
  ) { }

  ngOnInit(): void {
    this.ibgeService.citiesByState()
      .subscribe(municipios => {
        this.municipios = municipios;
        // {from: "Londrina - PR", to: "São Paulo - SP"}
        this.locationFromControl.setValue('Londrina - PR');
        this.locationToControl.setValue('São Paulo - SP');
        this.selectedAirship = this.airships[0];
        this.calculateRoute();
        // this.step = 1;
      }, err => {
        alert('Houve um erro inesperado ao listar os municípios');
      });

    let startPoint = { lat: -25.43615638835874, lng: -49.2589101856207 };
    this.map = new google.maps.Map(document.querySelector('#map'), {
      center: startPoint,
      zoom: 15
    });

    this.filteredOptionsFrom = this.locationFromControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        filter(value => value.length >= 3),
        map(value => this._filter(value))
      );

      this.filteredOptionsTo = this.locationToControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(500),
        filter(value => value.length >= 3),
        map(value => this._filter(value))
      );


    // directionsrenderer
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      polylineOptions: {
        strokeColor: '#ff0000cc',
        strokeWeight: 6
      }
    });
  }

  displayFn(municipio: Municipio): string {
    return municipio && municipio.nome ? `${municipio.nome} - ${municipio.microrregiao.mesorregiao.UF.sigla}` : '';
  }

  private _filter(value: string): Municipio[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.municipios.filter(municipio => municipio.nome.trim().toLowerCase().includes(filterValue));
  }

  newRoute() {
    this.polylineAirship.setMap(null);
    this.directionsRenderer.setMap(null);
    this.step = 0;
  }

  updateRoute() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.step = 1;
    }, 1000);
  }

  async calculateRoute() {
    const t0 = performance.now();
    this.isLoading = true;
    const from = this.locationFromControl.value;
    const to = this.locationToControl.value;

    if(!from || !to) {
      this.isLoading = false;
      this._snackBar.open('Informe o local de partida e de destino.', 'OK',{
        duration: 2000
      });

      return;
    }

    if(!this.selectedAirship) {
      this.isLoading = false;
      this._snackBar.open('Selecione a aeronave', 'OK', {
        duration: 2000,
      });
      return;
    }

    
    const resultsFrom = await this.ibgeService.geocodeAddress( from );
    const resultsTo = await this.ibgeService.geocodeAddress( to );

    const request = {
      origin: from,
      destination: to,
      travelMode: 'DRIVING'
    };


    this.polylineAirship = new google.maps.Polyline({
      path: [ resultsFrom[0].geometry.location, resultsTo[0].geometry.location ],
      strokeColor: '#0A5E2B'
    });

    this.statusFlying.distance = google.maps.geometry.spherical.computeLength( this.polylineAirship.getPath() )/1000;

    // if(this.statusFlying.distance > this.selectedAirship.range) {
    //   this.isLoading = false;
    //   this._snackBar.open('A aeronave selecionada não tem autonomia necessária para esta viagem.','OK', {
    //     duration: 3000
    //   });
    //   return;
    // }

    this.polylineAirship.setMap( this.map );
    const d=this.statusFlying.distance/this.selectedAirship.maximumSpeed;
    const duration = moment.duration(d, 'hours');
    this.statusFlying.duration = `${duration.hours()} h ${duration.minutes()} min`
    this.statusFlying.countFuel = 0;

    if(this.statusFlying.distance > this.selectedAirship.range) {
      const stopForFuelTimes = Math.ceil( this.statusFlying.distance/this.selectedAirship.range ) - 1;
      this.statusFlying.duration = '----';
      this.statusFlying.countFuel = stopForFuelTimes;
    }


    this.directionsService.route(request, (result, status) => {
      if (status == 'OK') {
        console.log({result, status});
        const directionLeg = result.routes[0].legs[0];
        this.statusDriving.duration = directionLeg.duration.text.replace('horas', 'h').replace('minutos', 'min');
        this.statusDriving.distance = directionLeg.distance.value/1000;
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setDirections(result);
        this.step = 1;
        this.isLoading = false;
      }

      const t1 = performance.now();
      this._snackBar.open(`Operation took ${(t1 - t0).toFixed(2)} milliseconds.`, 'OK', {
        duration: 5000
      });
    });

    
  }

}
