import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ocr.chat.ai',
  appName: 'capture & answer - OCR Chat AI',
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
