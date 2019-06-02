import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {

  stations: any[] = [];

  constructor(private baseService: BaseService<any>, private location: Location) { }

  ngOnInit() {
    this.baseService.get('http://localhost:3000/api/Stations')
        .subscribe(stations => {
          console.log(stations.entity);
          this.stations = stations.entity;
        }, error => console.log(error));
  }

  goBack() {
    this.location.back();
  }

}
