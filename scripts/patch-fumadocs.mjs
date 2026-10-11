import fs from 'node:fs';
import path from 'node:path';

function findFiles(dir, filename, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findFiles(fullPath, filename, results);
    } else if (entry.name === filename) {
      results.push(fullPath);
    }
  }
  return results;
}

const baseCssFiles = findFiles(path.resolve('node_modules'), 'base.css');
let patchedCount = 0;

for (const file of baseCssFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('@apply ps-6 ms-2 border-s sm:ms-4 sm:ps-7;')) {
      const fixed = content.replace(
        '@apply ps-6 ms-2 border-s sm:ms-4 sm:ps-7;',
        `padding-inline-start: 1.5rem;
  margin-inline-start: 0.5rem;
  border-inline-start-width: 1px;
  @media (min-width: 640px) {
    margin-inline-start: 1rem;
    padding-inline-start: 1.75rem;
  }`
      );
      fs.writeFileSync(file, fixed, 'utf8');
      patchedCount++;
    }
  } catch (err) {
    // Ignore read/write errors for locked files
  }
}

if (patchedCount > 0) {
  console.log(`[postinstall] Patched ${patchedCount} base.css file(s) for Tailwind v4 compatibility.`);
}
