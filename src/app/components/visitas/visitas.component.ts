import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent implements OnInit {

  stations = [];
  public stationSelected;

  constructor(private baseService: BaseService<any>) { }

  ngOnInit() {
    this.baseService.get('http://localhost:3000/api/Stations')
      .subscribe(stations => {
        console.log(stations.entity);
        this.stations = stations.entity;
      });

  }

}
