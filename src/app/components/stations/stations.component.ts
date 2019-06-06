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
          this.stations = stations.entity;
        }, error => console.log(error));
  }

  goBack() {
    this.location.back();
  }

  deleteStation(index: number) {
    const id = this.stations[index].id;
    this.baseService.delete('http://localhost:3000/api/Stations/' + id)
        .subscribe(station => {
          console.log(station.entity);
          this.stations.splice(index, 1);
        }, error => console.log(error));
  }

}
