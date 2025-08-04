// metro.config.js - MINIMAL CONFIGURATION TO AVOID EXPORT CONFLICTS
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Disable problematic features that might cause export issues
config.resolver = {
  ...config.resolver,
  // Disable package exports temporarily to avoid FileStore export issues
  unstable_enablePackageExports: false,
};

// Use basic cache configuration without custom stores
config.cacheStores = undefined;

// Force reset cache to clear corrupted FileStore references
config.resetCache = true;

module.exports = config;
