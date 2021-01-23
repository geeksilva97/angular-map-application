import { Component, OnInit } from '@angular/core';


declare var google: any;

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit {

  isLoading: boolean = false;
  step: number = 0;

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
