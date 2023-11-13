import {
    Injectable
} from "@angular/core";
import { Platform } from "@ionic/angular";
import { CommonUseUtil } from "./common-use.util";
import { Camera } from "@capacitor/camera";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { AppStates } from "../app-states";
import { AdmobUtil } from "./admob.util";
@Injectable({
    providedIn: 'root'
})
export class NativePermissionsUtil {

    constructor(private platform: Platform,
                private appStates:AppStates,
                private admobUtil:AdmobUtil,
                private commonUseUtil : CommonUseUtil) {}

    async cameraAndroidPermission() {
      console.log("initAndroidPermissions",this.commonUseUtil.isNativeAndroid());
      if (!this.commonUseUtil.isNativeAndroid()) {
          // Return if not android platform
          return;
      }
      Camera.checkPermissions().then((el)=>{
          console.log('Camera.checkPermissions',el);
      })
        // Request camera permission
      const cameraPermission = await Camera.requestPermissions();

      console.log('Permissions granted cameraPermission',cameraPermission);
      if (cameraPermission) {
          // Both permissions granted; you can now use the camera and storage
        this.appStates.setPermissionStatus("camera");
        this.commonUseUtil.setIsStartCamera(true);
      } else {
          // Handle the case where permissions were not granted
          console.error('Permissions not granted cameraPermission');
      }
    }

    async storageAndroidPermission(){
      console.log("initAndroidPermissions",this.commonUseUtil.isNativeAndroid());
      if (!this.commonUseUtil.isNativeAndroid()) {
          // Return if not android platform
          return;
      }

      Filesystem.checkPermissions().then((el)=>{
        console.log('Filesystem.checkPermissions',el);
      })
      // Request storage permission (for saving photos)
      const storagePermission = await Filesystem.requestPermissions();

      console.log('Permissions granted storagePermission',storagePermission);
      if (storagePermission) {
        this.appStates.setPermissionStatus("storage");
          // Both permissions granted; you can now use the camera and storage
      } else {
          // Handle the case where permissions were not granted
          console.error('Permissions not granted storagePermission');
      }
    }
}
