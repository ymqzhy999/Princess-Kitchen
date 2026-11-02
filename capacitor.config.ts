import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ymq.princesskitchen',
  appName: '公主厨房',
  webDir: 'dist',
  android: {
    // 本地壳里只加载打包进 APK 的静态资源，不请求网络
    allowMixedContent: false,
  },
};

export default config;
