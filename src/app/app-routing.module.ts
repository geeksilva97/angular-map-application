import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeMapComponent } from './pages/home-map/home-map.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeMapComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
