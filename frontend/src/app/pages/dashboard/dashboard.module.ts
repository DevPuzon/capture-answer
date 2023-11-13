import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import {MatButtonModule} from '@angular/material/button';
import { TranslateModuleConfig } from 'src/app/core/configs/ngx-translate-module';
import { SharedComponentsModule } from 'src/app/shared/modules/shared-components.module';
import { DashboardPage } from './dashboard.page';

@NgModule({
  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    TranslateModuleConfig,
    SharedComponentsModule.forRoot(),
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
