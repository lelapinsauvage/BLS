#!/usr/bin/env node

/**
 * Auto-generate projects manifest
 * This script runs during Netlify build to discover all project JSON files
 * and generate the _manifest.json automatically
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '..', 'content', 'projects');
const MANIFEST_FILE = path.join(PROJECTS_DIR, '_manifest.json');

function generateManifest() {
  console.log('📦 Generating projects manifest...');

  // Check if projects directory exists
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.log('⚠️ Projects directory not found, creating empty manifest');
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify({ projects: [] }, null, 2));
    return;
  }

  // Read all files in the projects directory
  const files = fs.readdirSync(PROJECTS_DIR);

  // Filter for .json files (excluding _manifest.json)
  const projectSlugs = files
    .filter(file => file.endsWith('.json') && file !== '_manifest.json')
    .map(file => file.replace('.json', ''))
    .sort();

  console.log(`📋 Found ${projectSlugs.length} projects:`, projectSlugs);

  // Generate manifest
  const manifest = {
    projects: projectSlugs,
    generated: new Date().toISOString()
  };

  // Write manifest file
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  console.log('✅ Manifest generated successfully:', MANIFEST_FILE);
}

// Run the script
generateManifest();
