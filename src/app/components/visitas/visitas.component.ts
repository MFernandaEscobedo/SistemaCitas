import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent implements OnInit {

  stations = [];
  public stationSelected;
  public addressStationSelected;

  public inputDateSelected;
  public optionStation;
  public inputAddress;
  public inputPhone;

  options: DatepickerOptions = {
    firstCalendarDay: 1,
    minDate: new Date('2019-06-01'),
    displayFormat: 'DD/MM/YYYY',
    barTitleIfEmpty: 'Selecciona una fecha',
    placeholder: 'Selecciona una fecha',
    locale: esLocale
  };

  newVisit = {
    fullName: '',
    stationId: null,
    email: '',
    fullDate: null,
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null
  };

  visits = [];

  constructor(private baseService: BaseService<any>) {
  }

  ngOnInit() {
    this.optionStation = document.getElementById('selectStation');
    this.inputAddress = document.getElementById('inputAddress');
    this.inputPhone = document.getElementById('inputTelefono');

    this.baseService.get('http://localhost:3000/api/Stations')
      .subscribe(stations => {
        console.log(stations.entity);
        this.stations = stations.entity;
      });
  }

  changeStation(event) {
    this.stationSelected = this.stations[this.optionStation.selectedIndex - 1];
    console.log(this.stationSelected);
    this.inputAddress.value = this.stationSelected['address'];
    this.inputPhone.value = this.stationSelected['phone'];
  }

  addVisit() {
    this.baseService.post('http://localhost:3000/api/Visits', this.newVisit)
      .subscribe(visit => {
        console.log(visit.entity);
        this.stations.push(visit.entity);
      }, error => {
        console.log(error);
      });
  }

}
