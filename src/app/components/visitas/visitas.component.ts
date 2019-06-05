import { Component, OnInit} from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent implements OnInit {

  myForm: FormGroup;

  public stationSelected;
  public hourSelected;

  public inputDateSelected;
  public selectHour;
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

  stations = [];
  visits = [];
  invalidDays = [];
  hours = [];

  es: any;

  constructor(private baseService: BaseService<any>, public fb: FormBuilder) {
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

    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.optionStation = document.getElementById('selectStation');
    this.inputAddress = document.getElementById('inputAddress');
    this.inputPhone = document.getElementById('inputTelefono');
    this.selectHour = document.getElementById('selectHours');

    this.baseService.get('http://localhost:3000/api/Stations')
      .subscribe(stations => {
        console.log(stations.entity);
        this.stations = stations.entity;
      });
  }

  get f() { return this.myForm.controls; }

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
    console.log(this.myForm.value);

    this.baseService.post('http://localhost:3000/api/Visits', this.newVisit)
      .subscribe(visit => {
        console.log(visit.entity);
        this.stations.push(visit.entity);
      }, error => {
        console.log(error);
      });
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
      this.hours.splice(0, 100);
    }

    console.log(openHour);
    console.log(closeHour);

    for (let i = openHour; i < closeHour; i++) {
      for (let x = 0; x < 3; x++) {
        if (minutes === 60) {
          minutes = 0;
        }
        this.hours.push((i) + ':' + minutes);
        minutes += 20;
      }
    }
    console.log(this.hours);
  }

  getHour(event) {
    let partsHour = this.hourSelected.split(':');
    console.log(this.hourSelected);
    console.log(partsHour);

    this.newVisit.hour = parseInt(partsHour[0], 10);
    this.newVisit.minute = parseInt(partsHour[1], 10);
  }

}

