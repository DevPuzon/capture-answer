// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  environment:'local',
  deviceUID:'deviceIDExample02',
  apiBaseURL:"http://localhost:3000/",
  admobTest:true,
  admobBannerId:'ca-app-pub-2424323323577681/4618343494', // change this
  firebaseConfig: {
    apiKey: "AIzaSyBRS90bS-9u5IHjUw-jk5naV7k0MiJJyBY",
    authDomain: "ocr-chat-ai.firebaseapp.com",
    projectId: "ocr-chat-ai",
    messagingSenderId: "385358948807",
    appId: "1:385358948807:web:622f81b3b48c6fe99ad1e2",
    measurementId: "G-QQDQRN7QNP"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
