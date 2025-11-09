const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Config plugin para react-native-maps
 * Configura o Android para usar Google Maps com API key
 */
const withReactNativeMaps = (config, { googleMapsApiKey } = {}) => {
  if (!googleMapsApiKey) {
    console.warn('⚠️  GOOGLE_MAPS_API_KEY não encontrada. O app usará OpenStreetMap.');
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

    console.log('✅ Google Maps API key configurada no AndroidManifest');
    return config;
  });

  return config;
};

module.exports = withReactNativeMaps;

