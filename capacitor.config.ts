import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pillarsoflife.app', // Changed from com.5pillarsoflife
  appName: 'fivePillarsOfLife',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
 