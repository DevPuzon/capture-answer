import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capture.answer.ai',
  appName: 'capture & answer - AI Buddy',
  bundledWebRuntime: false,
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      synced: true
    }
  },
  ios: {
   // contentInset: "always"
  }
};

export default config;
