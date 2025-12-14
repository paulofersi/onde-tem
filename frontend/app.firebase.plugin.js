const { withPlugins } = require('@expo/config-plugins');
const { withAndroidGoogleServices } = require('@react-native-firebase/app/dist/config-plugins/withAndroidGoogleServices');
const { withIOSGoogleServices } = require('@react-native-firebase/app/dist/config-plugins/withIOSGoogleServices');

const withReactNativeFirebase = (config) => {
  return withPlugins(config, [
    withAndroidGoogleServices,
    withIOSGoogleServices,
  ]);
};

module.exports = withReactNativeFirebase;
