import { Component, OnInit } from '@angular/core';


declare var google: any;

@Component({
  selector: 'app-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss']
})
export class HomeMapComponent implements OnInit {

  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log(google);
    let startPoint = { lat: -25.43615638835874, lng: -49.2589101856207 };
    let map = new google.maps.Map(document.querySelector('#map'), {
      center: startPoint,
      zoom: 15
  });
  }

}
