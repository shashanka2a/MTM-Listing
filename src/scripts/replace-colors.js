#!/usr/bin/env node

/**
 * Color replacement script
 * Replaces old burgundy colors with new #800000 scheme
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const replacements = [
  { from: /#8b4513/g, to: '#800000' },  // Primary burgundy
  { from: /#723a0f/g, to: '#660000' },  // Hover state
  { from: /#6b3410/g, to: '#900000' },  // Secondary burgundy
  { from: /#5a2d0e/g, to: '#700000' },  // Secondary hover
];

const files = glob.sync('**/*.{tsx,ts,css}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**'],
  cwd: process.cwd()
});

let totalReplacements = 0;

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileChanged = false;

  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      content = content.replace(from, to);
      totalReplacements += matches.length;
      fileChanged = true;
    }
  });

  if (fileChanged) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${file}`);
  }
});

console.log(`\n✅ Complete! Replaced ${totalReplacements} color codes in ${files.length} files`);
