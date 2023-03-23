import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.valpal.app',
  appName: 'valpal',
  webDir: 'dist/valpal',
  bundledWebRuntime: false,
  plugins:{
    GoogleAuth:{
      scopes:["profile","email"],
      serverClientId:"118815907844-i43dqfmacai019ka882vl74drq676ikg.apps.googleusercontent.com",
      forceCodeForRefreshToken:true
    }
  }
};

export default config;
