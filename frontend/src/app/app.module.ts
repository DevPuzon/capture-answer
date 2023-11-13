import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {MatButtonModule} from '@angular/material/button';
import { SharedComponentsModule } from './shared/modules/shared-components.module';
import { TranslateModuleConfig } from './core/configs/ngx-translate-module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { register } from 'swiper/element/bundle';
import { MatTabsModule } from '@angular/material/tabs';
import { ImageCropperModule } from 'ngx-image-cropper';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
register();
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    ImageCropperModule,
    MatButtonModule,
    MatTabsModule,
    HttpClientModule,
    SharedComponentsModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    TranslateModuleConfig,
    BrowserModule,
    IonicModule.forRoot({
      menuType: 'overlay'
   }), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy,
     }],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
