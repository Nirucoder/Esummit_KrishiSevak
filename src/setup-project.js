#!/usr/bin/env node

/**
 * Setup script to organize KrishiSevak project structure
 * This script moves existing files to the proper src/ directory structure
 */

const fs = require('fs');
const path = require('path');

console.log('🌱 Setting up KrishiSevak project structure...\n');

// Directories to move to src/
const directoriesToMove = [
  'components',
  'services', 
  'utils',
  'supabase'
];

// Files to move to src/
const filesToMove = [
  'test-components.tsx'
];

// Create src directory if it doesn't exist
if (!fs.existsSync('src')) {
  fs.mkdirSync('src');
  console.log('✅ Created src/ directory');
}

// Move directories
directoriesToMove.forEach(dir => {
  const srcPath = path.join(process.cwd(), dir);
  const destPath = path.join(process.cwd(), 'src', dir);
  
  if (fs.existsSync(srcPath)) {
    try {
      // Move the directory
      fs.renameSync(srcPath, destPath);
      console.log(`✅ Moved ${dir}/ to src/${dir}/`);
    } catch (error) {
      console.log(`⚠️  Directory ${dir}/ already exists in src/`);
    }
  } else {
    console.log(`ℹ️  Directory ${dir}/ not found, skipping`);
  }
});

// Move individual files
filesToMove.forEach(file => {
  const srcPath = path.join(process.cwd(), file);
  const destPath = path.join(process.cwd(), 'src', file);
  
  if (fs.existsSync(srcPath)) {
    try {
      fs.renameSync(srcPath, destPath);
      console.log(`✅ Moved ${file} to src/${file}`);
    } catch (error) {
      console.log(`⚠️  File ${file} already exists in src/`);
    }
  } else {
    console.log(`ℹ️  File ${file} not found, skipping`);
  }
});

// Move guidelines directory to root if it exists in src
const guidelinesInSrc = path.join(process.cwd(), 'src', 'guidelines');
const guidelinesInRoot = path.join(process.cwd(), 'guidelines');

if (fs.existsSync(guidelinesInSrc) && !fs.existsSync(guidelinesInRoot)) {
  fs.renameSync(guidelinesInSrc, guidelinesInRoot);
  console.log('✅ Moved guidelines/ back to root');
}

// Clean up old files in root
const oldFiles = ['App.tsx', 'styles'];
oldFiles.forEach(item => {
  const itemPath = path.join(process.cwd(), item);
  if (fs.existsSync(itemPath)) {
    try {
      if (fs.statSync(itemPath).isDirectory()) {
        fs.rmSync(itemPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(itemPath);
      }
      console.log(`🗑️  Removed old ${item} from root`);
    } catch (error) {
      console.log(`⚠️  Could not remove ${item}: ${error.message}`);
    }
  }
});

console.log('\n🎉 Project structure setup complete!');
console.log('\nNext steps:');
console.log('1. npm install');
console.log('2. Copy .env.example to .env and configure your API keys');
console.log('3. npm run dev');
console.log('\nHappy farming! 🚜🌾');