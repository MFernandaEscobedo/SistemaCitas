import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-visitas-view',
  templateUrl: './visitas-view.component.html',
  styleUrls: ['./visitas-view.component.css']
})
export class VisitasViewComponent implements OnInit {

  visits = [];

  constructor(private baseService: BaseService<any>, private location: Location) { }

  ngOnInit() {
    this.baseService.get('http://localhost:3000/api/Visits')
        .subscribe(visits => {
          console.log(visits.entity);
          this.visits = visits.entity;
        }, error => console.log(error));
  }

  goBack() {
    this.location.back();
  }

}
