// skills.test.js — Structural integrity tests for CARIAK project
// Run: node --test test/skills.test.js
// Zero external dependencies — uses node:test and node:assert only.

const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// --- Helpers ---

function readDir(dir) {
  try { return fs.readdirSync(dir); } catch { return []; }
}

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf-8'); } catch { return null; }
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      rows.push(lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, '')));
    }
  }
  return { headers, rows };
}

// --- Test Suite ---

describe('CARIAK Project Structure', () => {

  // 1. CSV Validation
  describe('references/ CSV files', () => {
    const refDir = path.join(ROOT, 'references');
    const csvFiles = readDir(refDir).filter(f => f.endsWith('.csv'));

    it('should have at least 6 CSV files', () => {
      assert.ok(csvFiles.length >= 6, `Expected >= 6 CSVs, found ${csvFiles.length}: ${csvFiles.join(', ')}`);
    });

    csvFiles.forEach(file => {
      it(`"${file}" should have valid headers and >= 5 data rows`, () => {
        const content = readFile(path.join(refDir, file));
        assert.ok(content, `${file} is not empty`);
        const { headers, rows } = parseCSV(content);
        assert.ok(headers.length > 0, `${file}: has header row with ${headers.length} columns`);
        assert.ok(rows.length >= 5, `${file}: has ${rows.length} data rows (need >= 5)`);
      });
    });
  });

  // 2. SKILL.md Frontmatter
  describe('skills/*/SKILL.md frontmatter', () => {
    const skillsDir = path.join(ROOT, 'skills');
    const skillDirs = readDir(skillsDir).filter(d => {
      try { return fs.statSync(path.join(skillsDir, d)).isDirectory(); } catch { return false; }
    });

    it('should have at least 10 skill directories', () => {
      assert.ok(skillDirs.length >= 10, `Expected >= 10 skills, found ${skillDirs.length}`);
    });

    skillDirs.forEach(dir => {
      it(`"${dir}/SKILL.md" should have valid frontmatter with name and description`, () => {
        const filePath = path.join(skillsDir, dir, 'SKILL.md');
        const content = readFile(filePath);
        assert.ok(content, `${dir}/SKILL.md exists and is readable`);
        assert.ok(content.startsWith('---'), `${dir}/SKILL.md starts with '---'`);

        // Find the closing frontmatter marker
        const secondMarker = content.indexOf('---', 3);
        assert.ok(secondMarker > 0, `${dir}/SKILL.md has closing '---' frontmatter marker`);

        const frontmatter = content.slice(3, secondMarker).trim();
        assert.ok(/^name:\s*.+/m.test(frontmatter), `${dir}/SKILL.md frontmatter has 'name:'`);
        assert.ok(/^description:\s*.+/m.test(frontmatter), `${dir}/SKILL.md frontmatter has 'description:'`);
      });
    });
  });

  // 3. Template Validation
  describe('templates/', () => {
    const tmplDir = path.join(ROOT, 'templates');
    const tmplFiles = readDir(tmplDir).filter(f => f.endsWith('.md'));

    it('should have exactly 12 template files', () => {
      assert.strictEqual(tmplFiles.length, 12, `Expected 12 templates, found ${tmplFiles.length}: ${tmplFiles.join(', ')}`);
    });

    tmplFiles.forEach(file => {
      it(`"${file}" should contain {{ placeholders`, () => {
        const content = readFile(path.join(tmplDir, file));
        assert.ok(content, `${file} is readable`);
        assert.ok(/\{\{/.test(content), `${file} contains '{{' placeholders`);
      });
    });
  });

  // 4. Subagent Validation
  describe('subagents/', () => {
    const subDir = path.join(ROOT, 'subagents');
    const subFiles = readDir(subDir).filter(f => f.endsWith('.md'));

    it('should have exactly 5 subagent files', () => {
      assert.strictEqual(subFiles.length, 5, `Expected 5 subagents, found ${subFiles.length}: ${subFiles.join(', ')}`);
    });

    subFiles.forEach(file => {
      it(`"${file}" should have bilingual sections`, () => {
        const content = readFile(path.join(subDir, file));
        assert.ok(content, `${file} is readable`);
        const hasBilingual = content.includes('## English') || content.includes('## Bahasa Indonesia');
        assert.ok(hasBilingual, `${file} has '## English' or '## Bahasa Indonesia' section`);
      });
    });
  });

  // 5. Core File Existence
  describe('Core project files', () => {
    const requiredFiles = ['README.md', 'README.id.md', 'LICENSE'];

    requiredFiles.forEach(file => {
      it(`"${file}" should exist`, () => {
        const exists = fs.existsSync(path.join(ROOT, file));
        assert.ok(exists, `${file} must exist in project root`);
      });
    });
  });

  // 6. Reference File Count
  describe('references/ directory', () => {
    it('should have at least 10 reference files', () => {
      const refDir = path.join(ROOT, 'references');
      const allFiles = readDir(refDir);
      assert.ok(allFiles.length >= 10, `Expected >= 10 reference files, found ${allFiles.length}`);
    });
  });

});
