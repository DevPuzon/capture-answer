import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { PopupGiftComponent } from '../components/popup-gift/popup-gift.component';
import { CameraViewerComponent } from '../components/camera-viewer/camera-viewer.component';
import { CropImageComponent } from '../components/crop-image/crop-image.component';
import { TranslateModuleConfig } from 'src/app/core/configs/ngx-translate-module';
import { ProfileHeaderComponent } from '../components/profile-header/profile-header.component';

import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AdsViewerComponent } from '../components/ads-viewer/ads-viewer.component';
import { UnlockFeaturesComponent } from '../components/unlock-features/unlock-features.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRate } from '@awesome-cordova-plugins/app-rate/ngx';
import { MatRippleModule } from '@angular/material/core';
import { MessageComponent } from '../components/message/message.component';
import { ConversationComponent } from '../components/conversation/conversation.component';
import { CaptureResultComponent } from '../components/capture-result/capture-result.component';
import { CaptureChatComponent } from '../components/capture-chat/capture-chat.component';
import { ChatSuggestionComponent } from '../components/chat-suggestion/chat-suggestion.component';
import { ImageContainerComponent } from '../components/image-container/image-container.component';
import { NativePermissionComponent } from '../components/native-permission/native-permission.component';
const components = [
                      PopupGiftComponent,
                      CameraViewerComponent,
                      CropImageComponent,
                      ProfileHeaderComponent,
                      UnlockFeaturesComponent,
                      ImageContainerComponent,
                      AdsViewerComponent,
                      NativePermissionComponent,
                      MessageComponent,
                      ConversationComponent,
                      CaptureChatComponent,
                      ChatSuggestionComponent,
                      CaptureResultComponent
                   ];
@NgModule({
  imports: [
    MatTabsModule,
    MatRippleModule,
    MatButtonModule,
    ImageCropperModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    IonicModule.forRoot({
      mode: 'md'
    }),
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModuleConfig
  ],
  declarations: components,
  exports: components,
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class SharedComponentsModule {
  static forRoot() {
    return {
      ngModule: SharedComponentsModule,
      providers: [AppRate],
    };
  }
}
