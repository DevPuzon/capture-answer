import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenSourceLibrariesPageRoutingModule } from './open-source-libraries-routing.module';

import { OpenSourceLibrariesPage } from './open-source-libraries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpenSourceLibrariesPageRoutingModule
  ],
  declarations: [OpenSourceLibrariesPage]
})
export class OpenSourceLibrariesPageModule {}
