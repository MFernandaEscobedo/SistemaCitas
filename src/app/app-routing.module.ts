import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StationComponent } from './components/station/station.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

const routes: Routes = [
  { path: 'station', component: StationComponent },
  { path: 'navbar', component: NavbarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
