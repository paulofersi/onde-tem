const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Config plugin para react-native-maps
 * Configura o Android para usar Google Maps com API key
 */
const withReactNativeMaps = (config, { googleMapsApiKey } = {}) => {
  // Se não houver API key, retorna config sem modificações
  if (!googleMapsApiKey) {
    console.warn('⚠️  GOOGLE_MAPS_API_KEY não encontrada. O app usará OpenStreetMap.');
    return config;
  }

  // Configura o AndroidManifest para incluir a API key do Google Maps
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    
    // Adiciona a API key do Google Maps no AndroidManifest.xml
    const application = androidManifest.manifest.application[0];
    
    if (!application.metaData) {
      application.metaData = [];
    }

    // Remove meta-data existente do Google Maps se houver
    application.metaData = application.metaData.filter(
      (meta) => meta.$['android:name'] !== 'com.google.android.geo.API_KEY'
    );

    // Adiciona a nova API key
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

