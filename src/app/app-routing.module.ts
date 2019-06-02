import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StationComponent } from './components/station/station.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AdminComponent } from './components/admin/admin.component';
import { VisitasComponent } from './components/visitas/visitas.component';
import { StationsComponent } from './components/stations/stations.component';

const routes: Routes = [
  { path: 'station', component: StationComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'visitas', component: VisitasComponent },
  { path: 'stations', component: StationsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
