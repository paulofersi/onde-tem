const { withAndroidManifest } = require('@expo/config-plugins');

const withReactNativeMaps = (config, { googleMapsApiKey } = {}) => {
  if (!googleMapsApiKey) {
    return config;
  }

  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    
    const application = androidManifest.manifest.application[0];
    
    if (!application.metaData) {
      application.metaData = [];
    }

    application.metaData = application.metaData.filter(
      (meta) => meta.$['android:name'] !== 'com.google.android.geo.API_KEY'
    );

    application.metaData.push({
      $: {
        'android:name': 'com.google.android.geo.API_KEY',
        'android:value': googleMapsApiKey,
      },
    });

    return config;
  });

  return config;
};

module.exports = withReactNativeMaps;

