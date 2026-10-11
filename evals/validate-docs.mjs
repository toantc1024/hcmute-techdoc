import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const docsDir = path.join(projectRoot, 'content/docs');
const publicDir = path.join(projectRoot, 'public');

console.log('--- RUNNING DOC VALIDATION TESTS ---');

let passed = true;
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.mdx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('title:')) {
        console.error(`[FAIL] Missing title in: ${fullPath}`);
        passed = false;
      }
      // Check diagram paths
      const matches = content.matchAll(/src=["'](\/diagrams\/[^"']+)["']/g);
      for (const m of matches) {
        const imgPath = path.join(publicDir, m[1]);
        if (!fs.existsSync(imgPath)) {
          console.error(`[FAIL] Referenced image not found: ${m[1]} in ${file}`);
          passed = false;
        }
      }
    }
  }
}

scanDir(docsDir);

if (passed) {
  console.log('[SUCCESS] All MDX documents and diagram assets passed validation!');
  process.exit(0);
} else {
  console.error('[FAIL] Some validation checks failed.');
  process.exit(1);
}
