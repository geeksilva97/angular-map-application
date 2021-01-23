import { Component, OnInit } from '@angular/core';
import { Airship } from 'src/models/airship.interface';


declare var google: any;

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit {

  isLoading: boolean = false;
  step: number = 0;

  airships: Airship[] = [
    {
      name: 'Airbus H125',
      maximumSpeed: 287,
      fasCruiseSpeed: 260,
      range: 640,
      endurance: 15600
    },

    {
      name: 'Airbus H130',
      maximumSpeed: 287,
      fasCruiseSpeed: 235,
      range: 610,
      endurance: 14400
    },

    {
      name: 'Bell 505',
      maximumSpeed: 270,
      fasCruiseSpeed: 231,
      range: 566,
      endurance: 14400
    },


    {
      name: 'Bell 407',
      maximumSpeed: 270,
      fasCruiseSpeed: 246,
      range: 624,
      endurance: 14400
    },

    {
      name: 'Robinson R66 - Turbine',
      maximumSpeed: 260,
      fasCruiseSpeed: 200,
      range: 630,
      endurance: 10800
    },

    {
      name: 'Robinson R44 - Raven II',
      maximumSpeed: 240,
      fasCruiseSpeed: 200,
      range: 560,
      endurance: 10800
    }
  ];

  constructor() { }

  ngOnInit(): void {
    let startPoint = { lat: -25.43615638835874, lng: -49.2589101856207 };
    new google.maps.Map(document.querySelector('#map'), {
      center: startPoint,
      zoom: 15
    });
  }

  newRoute() {
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
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.step = 1;
    }, 1000);
  }

}
