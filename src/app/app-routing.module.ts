import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StationComponent } from './components/station/station.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AdminComponent } from './components/admin/admin.component';
import { VisitasComponent } from './components/visitas/visitas.component';
import { StationsComponent } from './components/stations/stations.component';
import { VisitasViewComponent } from './components/visitas-view/visitas-view.component';

const routes: Routes = [
  { path: 'station', component: StationComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'visit', component: VisitasComponent },
  { path: 'stations', component: StationsComponent },
  { path: 'visits', component: VisitasViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
