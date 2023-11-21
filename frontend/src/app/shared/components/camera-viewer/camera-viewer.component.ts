import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ModalController
} from '@ionic/angular';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  CommonUseUtil
} from 'src/app/core/utils/common-use.util';
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions
} from '@capacitor-community/camera-preview';
import {
  CameraPreviewFlashMode
} from '@capacitor-community/camera-preview';
import {
  AppStates
} from 'src/app/core/app-states';
import {
  Subject,
  takeUntil
} from 'rxjs';
import {
  NavigationEnd,
  Router
} from '@angular/router';
import {
  NativePermissionsUtil
} from 'src/app/core/utils/native-permissions.util';
import {
  AdmobUtil
} from 'src/app/core/utils/admob.util';
import {
  ToastService
} from 'src/app/services/toast.service';
import {
  CaptureResultComponent
} from '../capture-result/capture-result.component';
import {
  CropImageComponent
} from '../crop-image/crop-image.component';

@Component({
  selector: 'ocr-camera-viewer',
  templateUrl: './camera-viewer.component.html',
  styleUrls: ['./camera-viewer.component.scss'],
})
export class CameraViewerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject < void > ();
  isPremium = false;
  isCameraStarted = false;
  isCameraStop = false;
  constructor(private modalController: ModalController,
    private appStates: AppStates,
    private router: Router,
    private admobUtil: AdmobUtil,
    // private cameraPreview: CameraPreview,
    private toastService: ToastService,
    private nativePermissionUtil: NativePermissionsUtil,
    private commonUseUtil: CommonUseUtil,
    private dialog: MatDialog) {
    router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          console.log('URL changed to:', event.url);
          if (event.url.includes('main-camera-dashboard')) {
            commonUseUtil.setIsStartCamera(true);
          } else {
            commonUseUtil.setIsStartCamera(false);
          }
        }
      });
  }

  ngOnInit() {
    this.initialCalls();
  }

  initialCalls() {
    // #change
    this.nativePermissionUtil.cameraAndroidPermission();
    this.commonUseUtil.setIsStartCamera(true);
    this.init();
  }

  init() {
    console.log('cameraviewer init');
    this.appStates.listenIsUserPremium().pipe(takeUntil(this.destroy$))
      .subscribe((isPremium: boolean) => {
        this.isPremium = isPremium;
      });

    // this.appStates.listenCanShowAds().pipe(takeUntil(this.destroy$))
    //   .subscribe((canShowAd: boolean) => {
    //     if (!canShowAd) {
    //       this.admobUtil.hideBanner();
    //     } else if (canShowAd && !this.isPremium) {
    //       this.admobUtil.showBanner();
    //     }
    //   })

    this.appStates.listenIsStartCamera().pipe(takeUntil(this.destroy$))
      .subscribe((isStart: boolean) => {
        console.log('listenIsStartCamera', isStart,this.isCameraStarted);
        if (isStart == this.isCameraStarted) {
          return;
        }
        if (isStart) {
          this.startCamera();
        } else {
          this.onCameraStop();
        }
        this.isCameraStarted = isStart;
      })

  }

  async onShot() {
    const options: CameraPreviewPictureOptions = {
      quality: 90
    }
    try {
      let baseSixtyFourImage = (await CameraPreview.capture(options)).value;
      const capturePreview = `data:image/jpeg;base64,${baseSixtyFourImage}`;
      this.onNextComponent(capturePreview);
    } catch (error: any) {
      let msg = JSON.stringify(error);
      if (error && error.errorMessage) msg = error.errorMessage;
      console.log("Camera not found: " + msg);
      // this.toastService.presentToast("Camera not found: " + msg);
    }
  }

  async onNextComponent(capturePreview: string) {
    const captureId = this.commonUseUtil.getUID();
    const isCrop = this.appStates.getSettings().isCrop;
    let component: any = {};

    if (!this.isPremium) {
      this.admobUtil.showInterstitial();
    }

    if (isCrop) {
      component = {
        id: "crop-modal",
        component: CropImageComponent,
      }
    } else {
      component = {
        id: "capture-result",
        component: CaptureResultComponent,
      }
    }
    const modal = await this.modalController.create({
      // id:"crop-modal",
      // component:CropImageComponent,

      // id:"capture-chat",
      // component:CaptureChatComponent,

      ...component,

      componentProps: {
        captureId: captureId,
        capturedImage: capturePreview
      }
    })

    // this.commonUseUtil.setIsStartCamera(false);
    await modal.present();
  }

  async startCamera() {
    console.log('on startCamera');
    this.isCameraStop = false;
    const cameraPreviewOptions: CameraPreviewOptions = {
      parent: 'cameraContainer',
      className: 'camera-viewer--camera--container--video',
      position: 'rear',
      enableZoom: true,
      toBack: true,
      disableAudio: true
    };

    CameraPreview.start(cameraPreviewOptions);
  }

  isFlash = false;
  async onFlash() {
    if (!this.isFlash) {
      const cameraPreviewFlashMode: CameraPreviewFlashMode = 'torch';
      CameraPreview.setFlashMode({
        flashMode: cameraPreviewFlashMode
      }).catch((error) => {
        let msg = JSON.stringify(error);
        if (error && error.errorMessage) msg = error.errorMessage;
        this.toastService.presentToast("Error: " + msg);
      });
    } else {
      const cameraPreviewFlashMode: CameraPreviewFlashMode = 'off';
      CameraPreview.setFlashMode({
        flashMode: cameraPreviewFlashMode
      }).catch((error) => {
        let msg = JSON.stringify(error);
        if (error && error.errorMessage) msg = error.errorMessage;
        this.toastService.presentToast("Error: " + msg);
      });
    }
    this.isFlash = !this.isFlash;
  }

  async onGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Photos,
        resultType: CameraResultType.Uri
      });
      var imageUrl = await this.commonUseUtil.readFileAsBase64(image.path!) as string;
      this.onNextComponent(imageUrl);
    } catch (error: any) {
      let msg = JSON.stringify(error);
      if (error && error.errorMessage) msg = error.errorMessage;
      // this.toastService.presentToast("Error: "+msg);
    }
  }

  onCameraStop() {
    console.log('on CameraStop');
    if (this.isCameraStop) {
      return;
    }
    this.isCameraStop = true;
    CameraPreview.stop();
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy oncameraviewer")
    this.onCameraStop();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
