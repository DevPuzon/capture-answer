import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SliderPageRoutingModule } from './slider-routing.module';

import { SliderPage } from './slider.page';
import { TranslateModuleConfig } from 'src/app/core/configs/ngx-translate-module';
import { SharedComponentsModule } from 'src/app/shared/modules/shared-components.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    MatButtonModule,
    CommonModule,
    FormsModule,
    IonicModule,
    SliderPageRoutingModule,
    TranslateModuleConfig,
    SharedComponentsModule.forRoot(),
  ],
  declarations: [SliderPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SliderPageModule {}
