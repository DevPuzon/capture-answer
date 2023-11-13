import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainCameraDashboardPageRoutingModule } from './main-camera-dashboard-routing.module';

import { MainCameraDashboardPage } from './main-camera-dashboard.page';
import { TranslateModuleConfig } from 'src/app/core/configs/ngx-translate-module';
import { SharedComponentsModule } from 'src/app/shared/modules/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainCameraDashboardPageRoutingModule,
    TranslateModuleConfig,
    SharedComponentsModule.forRoot(),
  ],
  declarations: [MainCameraDashboardPage]
})
export class MainCameraDashboardPageModule {}
