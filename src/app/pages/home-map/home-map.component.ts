import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Airship } from 'src/models/airship.interface';
import * as moment from 'moment';


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

  fromControl = new FormControl();
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  constructor() { }

  ngOnInit(): void {
    let startPoint = { lat: -25.43615638835874, lng: -49.2589101856207 };
    this.map = new google.maps.Map(document.querySelector('#map'), {
      center: startPoint,
      zoom: 15
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this.filteredOptions = this.fromControl.valueChanges
      .pipe(
        startWith(''),
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

  displayFn(place: any): string {
    return place && place.description ? place.description : '';
  }

  private _filter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.places.filter(place => place.description.toLowerCase().includes(filterValue));
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

  calculateRoute() {

    const from = this.fromControl.value;
    const to = this.myControl.value;

    this.directionsRenderer.setMap(this.map);

    const start = from.description;
    const end = to.description;
    const request = {
      origin: start,
      destination: end,
      travelMode: 'DRIVING'
    };

    // new google.maps.Marker({
    //   map: this.map,
    //   position: from.position
    // });

    // new google.maps.Marker({
    //   map: this.map,
    //   position: to.position
    // });


    this.polylineAirship = new google.maps.Polyline({
      map: this.map,
      path: [ from.position, to.position ],
      strokeColor: '#0A5E2B'
    });

    const airPlane = this.airships[0];

    this.statusFlying.distance = google.maps.geometry.spherical.computeLength( this.polylineAirship.getPath() )/1000;
    const d=this.statusFlying.distance/airPlane.maximumSpeed;
    const duration = moment.duration(d, 'hours');
    this.statusFlying.duration = `${duration.hours()} h ${duration.minutes()} min`


    this.directionsService.route(request, (result, status) => {
      if (status == 'OK') {
        console.log({result, status});
        const directionLeg = result.routes[0].legs[0];
        this.statusDriving.duration = directionLeg.duration.text.replace('horas', 'h').replace('minutos', 'min');
        this.statusDriving.distance = directionLeg.distance.value/1000;
        this.directionsRenderer.setDirections(result);
      }
    });

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.step = 1;
    }, 1000);
  }

}
