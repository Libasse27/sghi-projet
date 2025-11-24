#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(msg){ console.log(`[postinstall] ${msg}`); }

try {
  const iosDir = path.join(process.cwd(), 'ios');
  if (process.platform === 'win32') {
    log('Windows environment detected; skipping CocoaPods install.');
    process.exit(0);
  }
  if (!fs.existsSync(iosDir)) {
    log('No ios directory found; skipping CocoaPods install.');
    process.exit(0);
  }
  log('Running pod install in ios directory...');
  execSync('cd ios && pod install', { stdio: 'inherit' });
  log('CocoaPods installation completed.');
} catch (err) {
  log(`Non-fatal error during pod install: ${err.message}`);
  process.exit(0);
}
