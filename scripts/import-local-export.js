/**
 * Helper to generate Migration B from a local techdocs_state_export.json
 * Usage: node scripts/import-local-export.js [path-to-export.json]
 */
const fs = require('fs');
const path = require('path');

const exportFile = process.argv[2] || './techdocs_state_export.json';
if (!fs.existsSync(exportFile)) {
  console.log(`File ${exportFile} not found. Using src/services/admin-seed.json`);
  process.exit(0);
}

const raw = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
const seed = JSON.parse(fs.readFileSync('./src/services/admin-seed.json', 'utf8'));

const merged = {
  criteria: raw.criteria || seed.criteria,
  docSections: raw.sections || seed.docSections,
  phases: raw.phases || seed.phases,
  units: raw.units || seed.units,
};

const minified = JSON.stringify(merged);
const candidatePath = './supabase/migrations/20261017000002_data_migration_candidate.sql';
let currentSql = fs.readFileSync(candidatePath, 'utf8');

currentSql = currentSql.replace(/\$SEED\$.*?\$SEED\$/s, `$SEED$${minified}$SEED$`);
fs.writeFileSync(candidatePath, currentSql);
console.log(`Updated ${candidatePath} with exported local state!`);
