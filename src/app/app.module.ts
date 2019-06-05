import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Services
import { BaseService } from './services/base.service';

// Modulos
import { NgDatepickerModule } from 'ng2-datepicker';
import { CalendarModule } from 'primeng/calendar';

import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Componentes
import { AppComponent } from './app.component';
import { StationComponent } from './components/station/station.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AdminComponent } from './components/admin/admin.component';
import { VisitasComponent } from './components/visitas/visitas.component';
import { StationsComponent } from './components/stations/stations.component';
import { VisitasViewComponent } from './components/visitas-view/visitas-view.component';

@NgModule({
  declarations: [
    AppComponent,
    StationComponent,
    NavbarComponent,
    AdminComponent,
    VisitasComponent,
    StationsComponent,
    VisitasViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgDatepickerModule,
    CalendarModule,
    BrowserAnimationsModule,
    BrowserModule
  ],
  providers: [BaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
