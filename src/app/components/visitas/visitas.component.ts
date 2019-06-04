import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent implements OnInit {

  stations = [];
  public stationSelected;

  public inputDateSelected;
  public hourSelected;
  public optionStation;
  public inputAddress;
  public inputPhone;

  newVisit = {
    fullName: '',
    stationId: null,
    email: '',
    fullDate: '',
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null
  };

  visits = [];

  es: any;
  invalidDays = [];
  hours = [];

  constructor(private baseService: BaseService<any>) {
  }

  ngOnInit() {

    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      monthNames: [ "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
      today: 'Hoy',
      clear: 'Borrar'
    };

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

    this.newVisit.stationId = this.stationSelected.id;
  }

  addVisit() {
    const date = new Date(this.inputDateSelected);
    this.newVisit.year = date.getFullYear();
    this.newVisit.month = date.getMonth() + 1 ;
    this.newVisit.day = date.getDate();

    console.log(this.newVisit);

    /* this.baseService.post('http://localhost:3000/api/Visits', this.newVisit)
      .subscribe(visit => {
        console.log(visit.entity);
        this.stations.push(visit.entity);
      }, error => {
        console.log(error);
      }); */
  }

  getInvalidDays(event) {
    const previewStation = this.stations[0];

    if (previewStation.address !== this.stationSelected.address) {
      this.invalidDays.splice(0, 10);
    }

    if (this.stationSelected.monday === false) {
      this.invalidDays.push(1);
    }
    if (this.stationSelected.tuesday === false) {
      this.invalidDays.push(2);
    }
    if (this.stationSelected.wednesday === false) {
      this.invalidDays.push(3);
    }
    if (this.stationSelected.thursday === false) {
      this.invalidDays.push(4);
    }
    if (this.stationSelected.friday === false) {
      this.invalidDays.push(5);
    }
    if (this.stationSelected.saturday === false) {
      this.invalidDays.push(6);
    }
    if (this.stationSelected.sunday === false) {
      this.invalidDays.push(0);
    }
    console.log(this.invalidDays);
  }

  getSchedule(event) {

    let minutes = 0;
    let openHour: number = this.stationSelected.openHour;
    let closeHour: number = this.stationSelected.closeHour;

    const previewStation = this.stations[0];

    if (previewStation.address !== this.stationSelected.address) {
      this.hours.splice(0, 20);
    }

    console.log(openHour);
    console.log(closeHour);

    for (let i = openHour; i <= closeHour; i++) {
      this.hours.push(openHour + ':' + minutes);
      minutes += 20;
    }

    console.log(this.hours);
  }

}

