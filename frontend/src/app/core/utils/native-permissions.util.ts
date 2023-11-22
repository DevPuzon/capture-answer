import {
  Injectable
} from "@angular/core";
import {
  AlertController,
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
    private alertController: AlertController,
    private admobUtil: AdmobUtil,
    private commonUseUtil: CommonUseUtil) {}


  initNativePermission() {
    this.cameraAndroidPermission();
    this.storageAndroidPermission();
    this.checkPermissions();
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
      const alert = await this.alertController.create({
        message: "Please allow camera permission",
        backdropDismiss: false
      });
      await alert.present();
    }
  }

  async storageAndroidPermission() {
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
    if (storagePermission) {
      this.appStates.setPermissionStatus("storage");
      // Both permissions granted; you can now use the camera and storage
    } else {
      // Handle the case where permissions were not granted
      console.error('Permissions not granted storagePermission');
      const alert = await this.alertController.create({
        message: "Please allow storage permission",
        backdropDismiss: false
      });
      await alert.present();
    }
  }


  checkPermissions() {
    console.log('checkPermissions ');
    const isPermitted = parseInt(LStorage.get("NATIVE_PERMITTED") || '0');
    console.log('checkPermissions ',isPermitted);
    if (isPermitted) {
      return;
    }

    let isShowAllowPermission = false;
    let isAlreadyShown = false;
    let isGranted = true;
    let doneChecking = false;
    const interval = setInterval(async () => {
      if (doneChecking) {
        console.log('checkPermissions done checking ');
        return;
      }

      const cameraPermission = await Camera.requestPermissions();
      console.log("checkPermissions cameraPermission", cameraPermission);
      if (cameraPermission.camera == 'denied') {
        isShowAllowPermission = true;
      }
      if (cameraPermission.camera == 'granted') {
        isShowAllowPermission = false;
        isGranted = true;
      }else{
        isGranted = false;
      }

      // const storagePermission = await Filesystem.requestPermissions();
      // console.log("checkPermissions storagePermission", storagePermission);
      // if (storagePermission.publicStorage == 'denied') {
      //   isShowAllowPermission = true;
      // }
      // if (storagePermission.publicStorage == 'granted') {
      //   isShowAllowPermission = false;
      // }

      if (isShowAllowPermission && !isAlreadyShown) {
        // show permission
        console.log('checkPermissions show permission ');
        isAlreadyShown = true;
        LStorage.set('NATIVE_PERMITTED',"0");
        this.showAllowPermission();
      }

      if(!isShowAllowPermission && isGranted){
        //  granted all permission
        console.log('checkPermissions granted all permission ');
        LStorage.set('NATIVE_PERMITTED',"1");
        doneChecking = true;
        clearInterval(interval);
      }

    }, 1000);
  }


  async showAllowPermission() {
    const modal = await this.modalController.create({
      component: NativePermissionComponent,
      backdropDismiss:false
    })
    await modal.present();
  }

}
