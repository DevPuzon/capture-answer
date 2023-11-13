import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenSourceLibrariesPage } from './open-source-libraries.page';

const routes: Routes = [
  {
    path: '',
    component: OpenSourceLibrariesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenSourceLibrariesPageRoutingModule {}
