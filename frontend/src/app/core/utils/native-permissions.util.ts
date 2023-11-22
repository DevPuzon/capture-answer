import {
  Injectable
} from "@angular/core";
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform
} from "@ionic/angular";
import {
  CommonUseUtil
} from "./common-use.util";
import {
  Camera
} from "@capacitor/camera";
import {
  Filesystem,
  Directory,
  Encoding
} from '@capacitor/filesystem';
import {
  AppStates
} from "../app-states";
import {
  AdmobUtil
} from "./admob.util";
import {
  LStorage
} from "./lstorage.util";
import { NativePermissionComponent } from "src/app/shared/components/native-permission/native-permission.component";
@Injectable({
  providedIn: 'root'
})
export class NativePermissionsUtil {

  constructor(private platform: Platform,
    private modalController : ModalController,
    private appStates: AppStates,
    private loadingController: LoadingController,
    private admobUtil: AdmobUtil,
    private commonUseUtil: CommonUseUtil) {}


  initNativePermission() {
    console.log("initAndroidPermissions", this.commonUseUtil.isNativeAndroid());
    if (!this.commonUseUtil.isNativeAndroid()) {
      // Return if not android platform
      return;
    }
    this.cameraAndroidPermission();
    this.storageAndroidPermission();
    this.checkCameraPermissions();
  }

  async cameraAndroidPermission() {
    console.log("initAndroidPermissions", this.commonUseUtil.isNativeAndroid());
    if (!this.commonUseUtil.isNativeAndroid()) {
      // Return if not android platform
      return;
    }
    Camera.checkPermissions().then((el) => {
      console.log('Camera.checkPermissions', el);
    })
    // Request camera permission
    const cameraPermission = await Camera.requestPermissions();

    console.log('Permissions granted cameraPermission', cameraPermission);
    if (cameraPermission) {
      // Both permissions granted; you can now use the camera and storage
      this.appStates.setPermissionStatus("camera");
      this.commonUseUtil.setIsStartCamera(true);
    } else {
      // Handle the case where permissions were not granted
      console.error('Permissions not granted cameraPermission');
      // const alert = await this.alertController.create({
      //   message: "Please allow camera permission",
      //   backdropDismiss: false
      // });
      // await alert.present();
    }
  }

  async storageAndroidPermission() {
    if (!this.commonUseUtil.isNativeAndroid()) {
      // Return if not android platform
      return;
    }

    console.log("initAndroidPermissions", this.commonUseUtil.isNativeAndroid());
    if (!this.commonUseUtil.isNativeAndroid()) {
      // Return if not android platform
      return;
    }

    Filesystem.checkPermissions().then((el) => {
      console.log('Filesystem.checkPermissions', el);
    })
    // Request storage permission (for saving photos)
    const storagePermission = await Filesystem.requestPermissions();

    console.log('Permissions granted storagePermission', storagePermission);
    // if (storagePermission) {
    //   this.appStates.setPermissionStatus("storage");
    //   // Both permissions granted; you can now use the camera and storage
    // } else {
    //   // Handle the case where permissions were not granted
    //   console.error('Permissions not granted storagePermission');
    //   const alert = await this.alertController.create({
    //     message: "Please allow storage permission",
    //     backdropDismiss: false
    //   });
    //   await alert.present();
    // }
  }


  async checkCameraPermissions() {
    console.log('checkCameraPermissions ');

    const cameraPermission = await Camera.checkPermissions();
    console.log('checkCameraPermissions cameraPermission',cameraPermission);
    if (cameraPermission.camera == 'granted') {
      this.appStates.setShowSplash(true);
      setTimeout(() => {
        this.appStates.setPermissionStatus("camera");
        this.commonUseUtil.setIsStartCamera(true);
        this.appStates.setShowSplash(false);
      }, 1000);
      return;
    }


    let isShowAllowPermission = false;
    let isAlreadyShown = false;
    let isGranted = true;
    let doneChecking = false;

    const modal = await this.modalController.create({
      component: NativePermissionComponent,
      backdropDismiss:false
    })

    const interval = setInterval(async () => {
      if (doneChecking) {
        console.log('checkCameraPermissions done checking ');
        return;
      }

      const cameraPermission = await Camera.checkPermissions();
      console.log("checkCameraPermissions cameraPermission", cameraPermission);
      if (cameraPermission.camera == 'granted') {
        isShowAllowPermission = false;
        isGranted = true;

        this.appStates.setShowSplash(true);
        this.appStates.setPermissionStatus("camera");
        this.commonUseUtil.setIsStartCamera(true);
        setTimeout(() => {
          this.commonUseUtil.setIsStartCamera(false);
          setTimeout(async () => {
            this.commonUseUtil.setIsStartCamera(true);
            this.appStates.setShowSplash(false);
          }, 1100);
        }, 1100);

      }else{
        isGranted = false;
        isShowAllowPermission = true;
      }

      if (isShowAllowPermission && !isAlreadyShown) {
        // show permission
        console.log('checkCameraPermissions show permission ');
        isAlreadyShown = true;
        await modal.present();
      }

      if(!isShowAllowPermission && isGranted){
        //  granted all permission
        console.log('checkCameraPermissions granted all permission ');
        doneChecking = true;
        await modal.dismiss();
        clearInterval(interval);
      }

    }, 1000);
  }
}
