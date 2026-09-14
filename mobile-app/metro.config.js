const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// RunAnywhere SDK configuration
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true,
  unstable_conditionNames: ['react-native', 'browser', 'require'],
};

module.exports = config;
