import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainCameraDashboardPage } from './main-camera-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: MainCameraDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainCameraDashboardPageRoutingModule {}
