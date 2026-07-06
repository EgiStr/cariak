#!/usr/bin/env node
'use strict';

// ─── stdlib ───────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const os = require('os');
const cp = require('child_process');

// ─── helpers ──────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const REFERENCES_DIR = path.join(ROOT, 'references');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function exists(filePath) {
  try { fs.accessSync(filePath); return true; } catch { return false; }
}

function isDir(filePath) {
  try { return fs.statSync(filePath).isDirectory(); } catch { return false; }
}

function readVersion() {
  const pkg = readJSON(path.join(ROOT, 'package.json'));
  return (pkg && pkg.version) || 'unknown';
}

// ─── CSV parser (handles quoted fields with embedded commas/newlines) ─────

function parseCsvLine(line) {
  const fields = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  fields.push(field);
  return fields;
}

function parseCsvContent(content) {
  // Handle quoted fields that span multiple lines
  const lines = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < content.length && content[i + 1] === '"') {
        current += '""';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      current += ch;
    } else if (ch === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else if (ch === '\r') {
      // skip \r
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);

  return lines.map(parseCsvLine);
}

// ─── agent detection ──────────────────────────────────────────────────────

const HOME = os.homedir();
const IS_WIN = process.platform === 'win32';

function detectAgents() {
  const agents = [];

  const opencodeConfig = path.join(HOME, '.config', 'opencode', 'opencode.json');
  if (exists(opencodeConfig)) agents.push({ name: 'opencode', configPath: opencodeConfig, type: 'opencode' });

  const claudeDir = path.join(HOME, '.claude');
  if (isDir(claudeDir)) agents.push({ name: 'claude', configPath: claudeDir, type: 'claude' });

  const codexDir = path.join(HOME, '.codex');
  if (isDir(codexDir)) agents.push({ name: 'codex', configPath: codexDir, type: 'codex' });

  return agents;
}

// ─── commands ─────────────────────────────────────────────────────────────

// --- setup ---
function cmdSetup(targetAgent, jsonMode) {
  const agents = detectAgents();
  const results = {};

  if (agents.length === 0) {
    if (jsonMode) return { ok: false, error: 'No supported agents detected', setup: {} };
    console.log('No supported agents detected (OpenCode, Claude Code, or Codex).');
    return;
  }

  const filtered = (targetAgent === 'all' || !targetAgent)
    ? agents
    : agents.filter(a => a.name === targetAgent);

  if (filtered.length === 0 && targetAgent !== 'all' && targetAgent) {
    if (jsonMode) return { ok: false, error: `Agent "${targetAgent}" not detected`, setup: {} };
    console.log(`Agent "${targetAgent}" not detected.`);
    return;
  }

  for (const agent of filtered) {
    try {
      switch (agent.type) {
        case 'opencode':
          results[agent.name] = setupOpenCode(agent.configPath);
          break;
        case 'claude':
          results[agent.name] = setupClaude(agent.configPath);
          break;
        case 'codex':
          results[agent.name] = setupCodex(agent.configPath);
          break;
      }
      if (!jsonMode) console.log(`  [${results[agent.name]}] ${agent.name}`);
    } catch (err) {
      results[agent.name] = 'failed';
      if (!jsonMode) console.log(`  [failed] ${agent.name}: ${err.message}`);
    }
  }

  if (jsonMode) return { ok: true, setup: results };
}

function setupOpenCode(configPath) {
  const config = readJSON(configPath) || {};
  if (!config.skills) config.skills = {};
  if (!config.skills.paths) config.skills.paths = [];

  const paths = config.skills.paths;
  if (!paths.includes(SKILLS_DIR)) {
    paths.push(SKILLS_DIR);
    writeJSON(configPath, config);
    return 'linked';
  }
  return 'already_linked';
}

function setupClaude(claudeDir) {
  const dest = path.join(claudeDir, 'skills', 'cariak');
  return copySkillsDir(SKILLS_DIR, dest);
}

function setupCodex(codexDir) {
  const dest = path.join(codexDir, 'skills', 'cariak');
  return copySkillsDir(SKILLS_DIR, dest);
}

function copySkillsDir(src, dest) {
  if (!exists(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  let copied = 0;
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(src, entry.name, 'SKILL.md');
    if (!exists(skillMd)) continue;

    const destDir = path.join(dest, entry.name);
    if (!exists(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(skillMd, path.join(destDir, 'SKILL.md'));
    copied++;
  }
  return copied > 0 ? 'copied' : 'no_skills_found';
}

// --- doctor ---
function cmdDoctor(strictMode, jsonMode) {
  const checks = [];
  let failures = 0;

  // 1. Node.js version
  const nodeOk = parseInt(process.versions.node.split('.')[0], 10) >= 18;
  checks.push({ check: 'Node.js >= 18', status: nodeOk ? 'PASS' : 'FAIL', detail: `v${process.versions.node}` });
  if (!nodeOk) failures++;

  // 2. package.json
  const pkgOk = exists(path.join(ROOT, 'package.json'));
  checks.push({ check: 'package.json', status: pkgOk ? 'PASS' : 'FAIL', detail: pkgOk ? 'found' : 'missing' });
  if (!pkgOk) failures++;

  // 3. SKILL.md frontmatter
  let skillOk = 0, skillFail = 0;
  if (isDir(SKILLS_DIR)) {
    const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    for (const dir of skillDirs) {
      const fp = path.join(SKILLS_DIR, dir, 'SKILL.md');
      if (!exists(fp)) { skillFail++; continue; }
      const content = fs.readFileSync(fp, 'utf8');
      if (!content.startsWith('---')) { skillFail++; continue; }
      const end = content.indexOf('---', 3);
      if (end === -1) { skillFail++; continue; }
      const fm = content.slice(3, end);
      if (!fm.includes('name:') || !fm.includes('description:')) { skillFail++; continue; }
      skillOk++;
    }
  }
  const skillAllOk = skillFail === 0;
  checks.push({
    check: 'SKILL.md files',
    status: skillAllOk ? 'PASS' : 'FAIL',
    detail: `${skillOk} valid, ${skillFail} invalid/missing`
  });
  if (!skillAllOk) failures++;

  // 4. CSV references
  let csvOk = 0, csvFail = 0;
  if (isDir(REFERENCES_DIR)) {
    const csvFiles = fs.readdirSync(REFERENCES_DIR).filter(f => f.endsWith('.csv'));
    for (const f of csvFiles) {
      try {
        const content = fs.readFileSync(path.join(REFERENCES_DIR, f), 'utf8');
        parseCsvContent(content);
        csvOk++;
      } catch {
        csvFail++;
      }
    }
  }
  const csvAllOk = csvFail === 0;
  checks.push({
    check: 'Reference CSVs',
    status: csvAllOk ? 'PASS' : 'FAIL',
    detail: `${csvOk} valid, ${csvFail} parse errors`
  });
  if (!csvAllOk) failures++;

  // 5. Templates
  let tplCount = 0;
  if (isDir(TEMPLATES_DIR)) {
    tplCount = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md')).length;
  }
  const tplOk = tplCount > 0;
  checks.push({
    check: 'Templates',
    status: tplOk ? 'PASS' : 'FAIL',
    detail: `${tplCount} template(s)`
  });
  if (!tplOk) failures++;

  // 6. Sub-agents
  const subDir = path.join(ROOT, 'subagents');
  let subCount = 0;
  if (isDir(subDir)) subCount = fs.readdirSync(subDir).filter(f => f.endsWith('.md')).length;
  const subOk = subCount >= 5;
  checks.push({
    check: 'Sub-agents',
    status: subOk ? 'PASS' : 'FAIL',
    detail: `${subCount} sub-agent(s)`
  });
  if (!subOk) failures++;

  // Output
  if (jsonMode) return { ok: failures === 0, checks, failures };

  const colCheck = 34;
  const colStatus = 8;
  for (const c of checks) {
    console.log(c.check.padEnd(colCheck) + '  ' + c.status.padEnd(colStatus) + '  ' + c.detail);
  }

  console.log('');
  if (failures === 0) {
    console.log('All checks passed. Cariak is ready.');
  } else {
    console.log(`${failures} check(s) failed.`);
    if (strictMode) process.exitCode = 1;
  }
}

// --- validate ---
function cmdValidate(jsonMode) {
  const errors = [];

  // CSV validation
  if (isDir(REFERENCES_DIR)) {
    const csvFiles = fs.readdirSync(REFERENCES_DIR).filter(f => f.endsWith('.csv'));
    for (const f of csvFiles) {
      const fp = path.join(REFERENCES_DIR, f);
      try {
        const content = fs.readFileSync(fp, 'utf8');
        const rows = parseCsvContent(content);
        if (rows.length < 2) {
          errors.push({ file: `references/${f}`, line: 1, message: 'CSV has no data rows' });
          continue;
        }
        const headerCols = rows[0].length;
        for (let i = 1; i < rows.length; i++) {
          if (rows[i].length === 1 && rows[i][0] === '') continue; // skip empty rows
          if (rows[i].length !== headerCols) {
            errors.push({
              file: `references/${f}`,
              line: i + 1,
              message: `column mismatch: expected ${headerCols}, got ${rows[i].length}`
            });
          }
        }
      } catch (err) {
        errors.push({ file: `references/${f}`, line: 0, message: `parse error: ${err.message}` });
      }
    }
  }

  // SKILL.md validation
  if (isDir(SKILLS_DIR)) {
    const skillDirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    for (const dir of skillDirs) {
      const fp = path.join(SKILLS_DIR, dir, 'SKILL.md');
      if (!exists(fp)) {
        errors.push({ file: `skills/${dir}/SKILL.md`, line: 0, message: 'file not found' });
        continue;
      }
      const content = fs.readFileSync(fp, 'utf8');
      if (!content.startsWith('---')) {
        errors.push({ file: `skills/${dir}/SKILL.md`, line: 1, message: 'missing YAML frontmatter (must start with ---)' });
        continue;
      }
      const end = content.indexOf('---', 3);
      if (end === -1) {
        errors.push({ file: `skills/${dir}/SKILL.md`, line: 1, message: 'unclosed YAML frontmatter' });
        continue;
      }
      const fm = content.slice(3, end);
      if (!fm.includes('name:')) {
        errors.push({ file: `skills/${dir}/SKILL.md`, line: 0, message: 'frontmatter missing "name:" field' });
      }
      if (!fm.includes('description:')) {
        errors.push({ file: `skills/${dir}/SKILL.md`, line: 0, message: 'frontmatter missing "description:" field' });
      }
    }
  }

  // Template existence check
  if (isDir(TEMPLATES_DIR)) {
    const tplFiles = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.md'));
    for (const f of tplFiles) {
      const fp = path.join(TEMPLATES_DIR, f);
      try {
        const content = fs.readFileSync(fp, 'utf8');
        if (content.trim().length === 0) {
          errors.push({ file: `templates/${f}`, line: 0, message: 'empty template file' });
        }
      } catch {
        errors.push({ file: `templates/${f}`, line: 0, message: 'unreadable template file' });
      }
    }
  }

  if (jsonMode) return { ok: errors.length === 0, errors };

  if (errors.length === 0) {
    console.log('Validation passed. No errors found.');
  } else {
    for (const err of errors) {
      const loc = err.line > 0 ? `:${err.line}` : '';
      console.log(`  ${err.file}${loc}: ${err.message}`);
    }
    console.log(`\n${errors.length} error(s) found.`);
    process.exitCode = 1;
  }
}

// --- bundle ---
function cmdBundle(skillName, outputPath, jsonMode) {
  const skills = skillName
    ? [skillName]
    : fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .filter(n => exists(path.join(SKILLS_DIR, n, 'SKILL.md')));

  if (skills.length === 0) {
    const err = { ok: false, error: `Skill "${skillName}" not found` };
    if (jsonMode) return err;
    console.error(`Skill "${skillName}" not found.`);
    process.exitCode = 1;
    return;
  }

  const isWin = process.platform === 'win32';
  const distDir = outputPath || (skillName ? process.cwd() : path.join(ROOT, 'dist'));
  if (!exists(distDir)) fs.mkdirSync(distDir, { recursive: true });

  const results = {};
  const errors = [];

  for (const name of skills) {
    const skillDir = path.join(SKILLS_DIR, name);
    const skillMd = path.join(skillDir, 'SKILL.md');
    const refDir = path.join(skillDir, 'references');
    const outName = name.endsWith('.skill') ? name : `${name}.skill`;
    const outFile = path.join(distDir, outName);

    // Create temp staging directory
    const tmpDir = path.join(os.tmpdir(), `cariak-bundle-${name}-${Date.now()}`);
    try {
      fs.mkdirSync(tmpDir, { recursive: true });

      // Copy SKILL.md
      fs.copyFileSync(skillMd, path.join(tmpDir, 'SKILL.md'));

      // Copy references/ if exists
      if (exists(refDir) && isDir(refDir)) {
        const refDest = path.join(tmpDir, 'references');
        fs.mkdirSync(refDest, { recursive: true });
        copyDirRecursive(refDir, refDest);
      }

      // .skillkit-mode marker
      fs.writeFileSync(path.join(tmpDir, '.skillkit-mode'), 'full\n', 'utf8');

      // Create zip using system command
      const zipPath = path.join(tmpDir, `${name}.zip`);
      if (isWin) {
        cp.execSync(
          `powershell -NoProfile -Command "Compress-Archive -Path '${tmpDir}\\*' -DestinationPath '${zipPath}' -Force"`,
          { stdio: 'pipe' }
        );
      } else {
        cp.execSync(`cd "${tmpDir}" && zip -r "${zipPath}" .`, { stdio: 'pipe' });
      }

      // Move zip to final .skill file (use copy+delete for cross-device safety)
      if (exists(outFile)) fs.unlinkSync(outFile);
      fs.copyFileSync(zipPath, outFile);
      fs.unlinkSync(zipPath);

      results[name] = 'ok';
      if (!jsonMode) console.log(`  [ok] ${outFile}`);
    } catch (err) {
      results[name] = 'failed';
      errors.push({ skill: name, error: err.message });
      if (!jsonMode) console.log(`  [failed] ${name}: ${err.message}`);
    } finally {
      // Cleanup temp
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  }

  if (jsonMode) {
    return { ok: errors.length === 0, results, errors };
  }

  if (errors.length > 0) {
    console.log(`\n${errors.length} skill(s) failed to bundle.`);
    process.exitCode = 1;
  }
}

function copyDirRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// --- version ---
function cmdVersion() {
  console.log(`cariak-pi v${readVersion()}`);
}

// --- help ---
function cmdHelp() {
  console.log([
    'cariak-pi — Cariak CLI tool',
    '',
    'Usage: npx cariak-pi <command> [options]',
    '',
    'Commands:',
    '  setup [--agent <name>]             Link skills to AI agents (default: all)',
    '  doctor [--strict]                  Verify Cariak environment',
    '  validate                           Validate project files (CSV, frontmatter, templates)',
    '  bundle [skill-name] [--output <dir>]  Package skill(s) into .skill ZIP archives',
    '  version                            Print version',
    '  help                               Show this help',
    '',
    'Options:',
    '  --json     Machine-readable JSON output',
    '  --strict   Exit with code 1 on any doctor failure',
    '',
    'Examples:',
    '  npx cariak-pi setup',
    '  npx cariak-pi setup --agent opencode',
    '  npx cariak-pi doctor --strict',
    '  npx cariak-pi validate --json',
    '  npx cariak-pi version',
  ].join('\n'));
}

// ─── main ─────────────────────────────────────────────────────────────────

function main() {
  const argv = process.argv.slice(2);
  const flags = [];
  let jsonMode = false;
  let strictMode = false;
  let agentTarget = '';
  let outputPath = '';

  // Parse flags
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') { jsonMode = true; continue; }
    if (a === '--strict') { strictMode = true; continue; }
    if (a === '--agent' && i + 1 < argv.length) {
      agentTarget = argv[i + 1];
      i++;
      continue;
    }
    if (a === '--output' && i + 1 < argv.length) {
      outputPath = argv[i + 1];
      i++;
      continue;
    }
    flags.push(a);
  }

  const cmd = flags[0];
  const cmdArgs = flags.slice(1);

  switch (cmd) {
    case 'setup': {
      // agent target: --agent flag takes priority, then first positional arg, else 'all'
      const target = agentTarget || cmdArgs[0] || 'all';
      const result = cmdSetup(target, jsonMode);
      if (jsonMode && result) console.log(JSON.stringify(result));
      break;
    }
    case 'doctor': {
      const result = cmdDoctor(strictMode, jsonMode);
      if (jsonMode && result) console.log(JSON.stringify(result));
      break;
    }
    case 'validate': {
      const result = cmdValidate(jsonMode);
      if (jsonMode && result) console.log(JSON.stringify(result));
      break;
    }
    case 'bundle': {
      const result = cmdBundle(cmdArgs[0] || '', outputPath, jsonMode);
      if (jsonMode && result) console.log(JSON.stringify(result));
      break;
    }
    case 'version':
      cmdVersion();
      break;
    case 'help':
    case undefined:
    case '--help':
    case '-h':
      cmdHelp();
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Run `npx cariak-pi help` for usage.');
      process.exitCode = 1;
  }
}

main();
