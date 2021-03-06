import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {

  nuevaEstacion = {
    address: '',
    phone: '',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    openHour: null,
    closeHour: null
  };

  estaciones = [];

  constructor(private baseService: BaseService<any>, private location: Location) { }

  ngOnInit() {
  }

  agregarEstacion() {
    this.baseService.post('http://localhost:3000/api/Stations', this.nuevaEstacion)
        .subscribe(data => {
          console.log(data.entity);
          this.estaciones.push(data.entity);
        }, err => {
          console.log(err);
        });
  }

  goBack() {
    this.location.back();
  }

}
