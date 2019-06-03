import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Services
import { BaseService } from './services/base.service';

// Components
import { NgDatepickerModule } from 'ng2-datepicker';

import { HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StationComponent } from './components/station/station.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AdminComponent } from './components/admin/admin.component';
import { VisitasComponent } from './components/visitas/visitas.component';
import { StationsComponent } from './components/stations/stations.component';

@NgModule({
  declarations: [
    AppComponent,
    StationComponent,
    NavbarComponent,
    AdminComponent,
    VisitasComponent,
    StationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgDatepickerModule
  ],
  providers: [BaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
