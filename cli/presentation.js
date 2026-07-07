// cariak-pi present — PPTX Presentation Generator
// Generates consulting-grade presentations using Pyramid Principle (Minto, 1960s)
// PptxGenJS library, zero native dependencies
// Entry: npx cariak-pi present --input <json> --output <path.pptx>

'use strict';

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');

const COLORS = {
  dark: '1B3A5C',
  mid: '2B579A',
  accent: '4472C4',
  light: 'D6E4F0',
  white: 'FFFFFF',
  black: '000000',
  red: 'C00000',
  green: '2E7D32',
  gray: '808080',
  grayLight: 'F2F2F2',
};

function loadInput(filePath) {
  if (!filePath) throw new Error('--input <file> is required');
  const fp = path.resolve(filePath);
  if (!fs.existsSync(fp)) throw new Error(`Input file not found: ${fp}`);
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

function generatePresentation(inputPath, outputPath) {
  const data = loadInput(inputPath);
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 16:9
  pptx.author = 'Cariak Deep Research Agent';
  pptx.title = data.title || 'Research Presentation';

  // ── Slide 1: Title ──
  const s1 = pptx.addSlide();
  s1.background = { color: COLORS.dark };
  s1.addText('CARIAK DEEP RESEARCH', { x: 0.5, y: 1.0, w: 12, h: 0.6, fontSize: 14, color: COLORS.light, align: 'center', fontFace: 'Arial' });
  s1.addText(data.title || 'Research Presentation', { x: 1, y: 2.0, w: 11, h: 1.5, fontSize: 36, bold: true, color: COLORS.white, align: 'center', fontFace: 'Arial' });
  s1.addText(data.subtitle || '', { x: 1, y: 3.5, w: 11, h: 0.8, fontSize: 18, color: COLORS.light, align: 'center', fontFace: 'Arial' });
  s1.addText(`${data.date || new Date().toISOString().slice(0, 10)}  |  Prepared by Cariak AI Research Agent`, { x: 1, y: 5.5, w: 11, h: 0.5, fontSize: 12, color: COLORS.gray, align: 'center', fontFace: 'Arial' });

  // ── Slide 2: Executive Summary (Pyramid Principle — Governing Thought) ──
  const s2 = pptx.addSlide();
  addSlideHeader(s2, 'Executive Summary', 'The Governing Thought');
  s2.addText(data.layperson_summary || data.executive_summary || data.summary || '', {
    x: 0.8, y: 1.5, w: 11.4, h: 2.5, fontSize: 16, color: COLORS.black, align: 'left', fontFace: 'Arial', lineSpacing: 28,
  });
  // Key metrics bar
  const conf = data.confidence || data.confidence_score || 'N/A';
  const totalSrc = data.total_sources || (data.source_diversity ? Object.values(data.source_diversity).reduce((a,b)=>a+b,0) : 0);
  s2.addText(`Confidence: ${conf}  |  Sources: ${totalSrc}  |  Methods: OSINT + GRADE + CASP`, {
    x: 0.8, y: 4.8, w: 11.4, h: 0.5, fontSize: 12, color: COLORS.gray, align: 'center', fontFace: 'Arial',
  });

  // ── Slide 3: Problem Statement (SCQA — Situation & Complication) ──
  const s3 = pptx.addSlide();
  addSlideHeader(s3, 'The Problem', 'What We Set Out to Solve');
  const problemItems = [
    { label: 'Context', value: data.problem_context || '' },
    { label: 'Why It Matters', value: data.problem_importance || '' },
    { label: 'Stakeholders', value: data.problem_stakeholders || '' },
    { label: 'Cost of Inaction', value: data.problem_cost_of_inaction || '' },
  ].filter(i => i.value);
  let py = 1.6;
  for (const item of problemItems) {
    s3.addText(item.label, { x: 0.8, y: py, w: 2.5, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, fontFace: 'Arial' });
    s3.addText(item.value, { x: 3.5, y: py, w: 8.5, h: 0.4, fontSize: 14, color: COLORS.black, fontFace: 'Arial' });
    py += 0.6;
  }

  // ── Slide 4: Research Questions ──
  const rqs = data.research_questions || data.questions || [];
  if (rqs.length > 0) {
    const s4 = pptx.addSlide();
    addSlideHeader(s4, 'Research Questions', 'What We Investigated');
    const rqRows = [['#', 'Question', 'What We Expected']];
    rqs.forEach((rq, i) => {
      rqRows.push([`RQ-${i + 1}`, rq.question || rq.title || '', rq.expected || rq.investigated || '']);
    });
    s4.addTable(rqRows, {
      x: 0.5, y: 1.5, w: 12, border: { type: 'solid', color: COLORS.light },
      colW: [1.0, 5.5, 5.5],
      fontSize: 12, fontFace: 'Arial', color: COLORS.black,
      rowH: [0.5, ...rqs.map(() => 0.6)],
      fill: { color: COLORS.white },
      firstRow: { bold: true, color: COLORS.white, fill: { color: COLORS.mid } },
      autoPage: true,
    });
  }

  // ── Slide 5: Methods ──
  const s5 = pptx.addSlide();
  addSlideHeader(s5, 'Research Methods', 'How We Found the Answers');
  const sd = data.source_diversity || {};
  s5.addText([
    { text: 'Approach: ', options: { bold: true, color: COLORS.accent } },
    { text: data.methodology_approach || 'Multi-source systematic research', options: {} },
  ], { x: 0.8, y: 1.6, w: 11.4, h: 0.4, fontSize: 14, fontFace: 'Arial' });
  const methodRows = [
    ['Source Domain', 'Count', 'Tools Used'],
    ['Internet (blogs, docs, articles)', `${sd.internet || 0}`, 'web-search, tavily, fetch'],
    ['Social (Reddit, HN, X, GitHub)', `${sd.social || 0}`, 'search_reddit, search_hackernews'],
    ['Academic (arXiv, PubMed, CrossRef)', `${sd.academic || 0}`, 'paper-search-mcp'],
    ['News (industry, press releases)', `${sd.news || 0}`, 'tavily news search'],
    ['Market (competitors, pricing)', `${sd.market || 0}`, 'web-search, tavily'],
  ];
  s5.addTable(methodRows, {
    x: 0.8, y: 2.3, w: 11.4, border: { type: 'solid', color: COLORS.light },
    colW: [6, 2, 3.4], fontSize: 12, fontFace: 'Arial',
    firstRow: { bold: true, color: COLORS.white, fill: { color: COLORS.mid } },
  });
  s5.addText('Validation: GRADE (Guyatt et al., 2008, BMJ) + CASP Checklists (UK NHS, 2018)', {
    x: 0.8, y: 5.5, w: 11.4, h: 0.4, fontSize: 11, color: COLORS.gray, fontFace: 'Arial', italic: true,
  });

  // ── Slide 6: First Principles ──
  if (data.first_principles_explanation || data.first_principles) {
    const s6 = pptx.addSlide();
    addSlideHeader(s6, 'First Principles', 'How It Works — The Mechanism');
    s6.addText(data.first_principles_explanation || data.first_principles || '', {
      x: 0.8, y: 1.6, w: 11.4, h: 4.5, fontSize: 14, color: COLORS.black, fontFace: 'Arial', lineSpacing: 26,
    });
  }

  // ── Slide 7: State of the Art ──
  const s7 = pptx.addSlide();
  addSlideHeader(s7, 'State of the Art', 'What Already Exists');
  const col1 = { x: 0.5, w: 5.8 };
  const col2 = { x: 6.7, w: 5.8 };
  s7.addText('Academic Literature', { ...col1, y: 1.4, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, fontFace: 'Arial' });
  s7.addText(data.academic_state_of_art || data.academic_literature || '', { ...col1, y: 1.9, h: 4, fontSize: 11, fontFace: 'Arial', lineSpacing: 20 });
  s7.addText('Industry & Products', { ...col2, y: 1.4, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, fontFace: 'Arial' });
  s7.addText(data.industry_state_of_art || data.industry_products || '', { ...col2, y: 1.9, h: 4, fontSize: 11, fontFace: 'Arial', lineSpacing: 20 });
  if (data.field_practice) {
    s7.addText(`Field Practice: ${data.field_practice}`, { x: 0.5, y: 5.5, w: 12, h: 0.5, fontSize: 10, color: COLORS.gray, fontFace: 'Arial', italic: true });
  }

  // ── Slide 8: Method Comparison Matrix ──
  const methods = data.method_comparison || data.methods || [];
  if (methods.length > 0) {
    const s8 = pptx.addSlide();
    addSlideHeader(s8, 'Method Comparison', 'Side-by-Side Evaluation');
    const mRows = [['Method', 'Accuracy', 'Data Need', 'Cost', 'Speed', 'Complexity', 'Best For']];
    methods.forEach(m => {
      mRows.push([m.name || '', m.accuracy || '', m.data || '', m.cost || '', m.latency || m.speed || '', m.complexity || '', m.best_use || '']);
    });
    s8.addTable(mRows, {
      x: 0.3, y: 1.5, w: 12.4, border: { type: 'solid', color: COLORS.light },
      colW: [2.2, 1.5, 1.5, 1.5, 1.5, 1.5, 2.7],
      fontSize: 10, fontFace: 'Arial',
      firstRow: { bold: true, color: COLORS.white, fill: { color: COLORS.mid } },
      autoPage: true,
    });
  }

  // ── Slide 9: Recommended Architecture ──
  if (data.recommended_architecture || data.architecture) {
    const s9 = pptx.addSlide();
    addSlideHeader(s9, 'Recommended Architecture', 'Blueprint for Implementation');
    s9.addText(data.recommended_architecture || data.architecture || '', {
      x: 0.8, y: 1.6, w: 11.4, h: 2, fontSize: 14, fontFace: 'Arial', lineSpacing: 24,
    });
    const comps = data.components || [];
    if (comps.length > 0) {
      const compText = comps.map(c => `• ${c.name || c.component}: ${c.description || c.role || ''}`).join('\n');
      s9.addText(compText, { x: 0.8, y: 3.5, w: 5.5, h: 2.5, fontSize: 11, fontFace: 'Arial', lineSpacing: 20 });
    }
    if (data.deployment_target) {
      s9.addText(`Deployment: ${data.deployment_target}`, { x: 0.8, y: 5.5, w: 11, h: 0.4, fontSize: 12, bold: true, color: COLORS.accent, fontFace: 'Arial' });
    }
  }

  // ── Slide 10: Implementation Roadmap ──
  const phases = data.phases || data.roadmap || [];
  if (phases.length > 0) {
    const s10 = pptx.addSlide();
    addSlideHeader(s10, 'Implementation Roadmap', 'From Zero to Production');
    const pRows = [['Phase', 'Goal', 'What to Build', 'Validation', 'Exit Criteria']];
    phases.forEach(p => {
      pRows.push([p.name || p.phase || '', p.goal || '', p.build || '', p.validation || '', p.exit || p.exit_criteria || '']);
    });
    s10.addTable(pRows, {
      x: 0.3, y: 1.5, w: 12.4, border: { type: 'solid', color: COLORS.light },
      colW: [1.8, 2.2, 2.8, 2.8, 2.8],
      fontSize: 10, fontFace: 'Arial',
      firstRow: { bold: true, color: COLORS.white, fill: { color: COLORS.mid } },
      autoPage: true,
    });
  }

  // ── Slide 11: Data Strategy + Evaluation ──
  const s11 = pptx.addSlide();
  addSlideHeader(s11, 'Data Strategy & Evaluation', 'What We Need & How We Measure');
  s11.addText('Data Requirements', { x: 0.5, y: 1.4, w: 5.8, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, fontFace: 'Arial' });
  const dataItems = [
    { label: 'Datasets', value: data.dataset_requirements || data.datasets },
    { label: 'Labels', value: data.label_requirements || data.labels },
    { label: 'Calibration', value: data.calibration_requirements },
    { label: 'Sampling', value: data.sampling_plan },
    { label: 'Quality Risks', value: data.data_quality_risks },
  ].filter(i => i.value);
  let dy = 1.9;
  for (const d of dataItems) {
    s11.addText(`${d.label}: ${d.value}`, { x: 0.5, y: dy, w: 5.8, h: 0.35, fontSize: 10, fontFace: 'Arial' });
    dy += 0.4;
  }
  s11.addText('Evaluation Protocol', { x: 6.7, y: 1.4, w: 5.8, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, fontFace: 'Arial' });
  const evalItems = [
    { label: 'Primary Metric', value: data.primary_metric },
    { label: 'Secondary', value: data.secondary_metrics },
    { label: 'Baseline', value: data.baseline },
    { label: 'Threshold', value: data.acceptance_threshold },
    { label: 'Design', value: data.validation_design },
  ].filter(i => i.value);
  let ey = 1.9;
  for (const e of evalItems) {
    s11.addText(`${e.label}: ${e.value}`, { x: 6.7, y: ey, w: 5.8, h: 0.35, fontSize: 10, fontFace: 'Arial' });
    ey += 0.4;
  }

  // ── Slide 12: Failure Modes ──
  const failures = data.failure_modes || data.failures || [];
  if (failures.length > 0) {
    const s12 = pptx.addSlide();
    addSlideHeader(s12, 'Failure Modes & Mitigations', 'What Could Go Wrong');
    const fRows = [['Failure Mode', 'Cause', 'Impact', 'Detection', 'Mitigation']];
    failures.forEach(f => {
      fRows.push([f.name || f.mode || '', f.cause || '', f.impact || '', f.detection || '', f.mitigation || '']);
    });
    s12.addTable(fRows, {
      x: 0.3, y: 1.5, w: 12.4, border: { type: 'solid', color: COLORS.light },
      colW: [2.2, 2.2, 2.2, 2.8, 3.0],
      fontSize: 10, fontFace: 'Arial',
      firstRow: { bold: true, color: COLORS.white, fill: { color: COLORS.red } },
      autoPage: true,
    });
  }

  // ── Slide 13: Alternatives ──
  if (data.alternatives_analysis || data.alternatives) {
    const s13 = pptx.addSlide();
    addSlideHeader(s13, 'Alternatives & Build-vs-Buy', 'Other Paths Considered');
    s13.addText(data.alternatives_analysis || data.alternatives || '', {
      x: 0.8, y: 1.6, w: 11.4, h: 2, fontSize: 14, fontFace: 'Arial', lineSpacing: 24,
    });
    const opts = data.options || data.alternatives_list || [];
    if (opts.length > 0) {
      const optText = opts.map(o => `• ${o.name || o.option}: ${o.description || ''} → ${o.verdict || ''}`).join('\n');
      s13.addText(optText, { x: 0.8, y: 3.5, w: 11.4, h: 2.5, fontSize: 11, fontFace: 'Arial', lineSpacing: 20 });
    }
  }

  // ── Slide 14: Gaps ──
  if (data.knowledge_gaps || (data.gaps && data.gaps.length > 0)) {
    const s14 = pptx.addSlide();
    addSlideHeader(s14, 'Knowledge Gaps', 'What We Still Don\'t Know');
    const gapList = data.gaps || data.knowledge_gaps_list || [];
    const gapText = data.knowledge_gaps || gapList.map(g => typeof g === 'string' ? g : g.description || '').filter(Boolean).join('\n');
    s14.addText(gapText || '', {
      x: 0.8, y: 1.6, w: 11.4, h: 4.5, fontSize: 14, fontFace: 'Arial', lineSpacing: 24,
    });
  }

  // ── Slide 15: Final Recommendation (Pyramid Principle — Conclusion) ──
  const s15 = pptx.addSlide();
  addSlideHeader(s15, 'Final Recommendation', 'What You Should Do');
  s15.addShape('rect', { x: 0.5, y: 1.5, w: 12, h: 3.5, fill: { color: COLORS.light }, rectRadius: 0.1 });
  s15.addText(data.final_recommendation || data.recommendation || '', {
    x: 1, y: 1.7, w: 11, h: 2.5, fontSize: 16, bold: true, color: COLORS.dark, fontFace: 'Arial', lineSpacing: 28, align: 'center',
  });
  const actions = data.actions || data.next_steps || [];
  if (actions.length > 0) {
    let ay = 5.2;
    actions.forEach((a, i) => {
      s15.addText(`${i + 1}. ${typeof a === 'string' ? a : a.text || ''}`, { x: 1, y: ay, w: 11, h: 0.3, fontSize: 12, fontFace: 'Arial' });
      ay += 0.35;
    });
  }

  // ── Slide 16: Confidence Assessment ──
  const s16 = pptx.addSlide();
  addSlideHeader(s16, 'Confidence Assessment', 'How Much to Trust This Research');
  const confRows = [
    ['Metric', 'Value'],
    ['Overall Confidence', `${data.confidence || data.confidence_score || 'N/A'}/1.0`],
    ['Evidence Quality (GRADE)', data.grade_rating || data.evidence_quality || 'N/A'],
    ['Strong Claims', `${data.strong_claims || 0}/${data.total_claims || 0}`],
    ['Weak Claims', `${data.weak_claims || 0}/${data.total_claims || 0}`],
    ['Unresolved Contradictions', `${data.unresolved_contradictions || 0}`],
  ];
  s16.addTable(confRows, {
    x: 1.5, y: 1.8, w: 10, border: { type: 'solid', color: COLORS.light },
    colW: [5, 5], fontSize: 14, fontFace: 'Arial',
    firstRow: { bold: true, color: COLORS.white, fill: { color: COLORS.mid } },
    rowH: [0.5, 0.4, 0.4, 0.4, 0.4, 0.4],
  });

  // ── Slide 17: References ──
  const sources = data.sources || data.references || [];
  if (sources.length > 0) {
    const s17 = pptx.addSlide();
    addSlideHeader(s17, 'References', 'Sources Cited');
    const refText = sources.slice(0, 12).map((s, i) => {
      const author = s.authors ? (Array.isArray(s.authors) ? s.authors.join(', ') : s.authors) : '';
      const year = s.year || s.published_date || '';
      return `[${i + 1}] ${author}${year ? ` (${year})` : ''}. ${s.title || ''}. ${s.url || ''}`;
    }).join('\n');
    s17.addText(refText, { x: 0.5, y: 1.5, w: 12, h: 5, fontSize: 9, fontFace: 'Arial', lineSpacing: 18 });
    if (sources.length > 12) {
      s17.addText(`... and ${sources.length - 12} more sources. See full report for complete bibliography.`, {
        x: 0.5, y: 6.2, w: 12, h: 0.4, fontSize: 10, color: COLORS.gray, fontFace: 'Arial', italic: true,
      });
    }
  }

  // ── Slide 18: Thank You / Next Steps ──
  const s18 = pptx.addSlide();
  s18.background = { color: COLORS.dark };
  s18.addText('Thank You', { x: 1, y: 2.0, w: 11, h: 1, fontSize: 40, bold: true, color: COLORS.white, align: 'center', fontFace: 'Arial' });
  s18.addText('Generated by Cariak Deep Research Agent', { x: 1, y: 3.2, w: 11, h: 0.6, fontSize: 16, color: COLORS.light, align: 'center', fontFace: 'Arial' });
  s18.addText(`npx cariak-pi present --input data.json`, { x: 1, y: 4.2, w: 11, h: 0.5, fontSize: 14, color: COLORS.gray, align: 'center', fontFace: 'Consolas' });

  // ── Save ──
  const outPath = outputPath || 'cariak-presentation.pptx';
  return pptx.writeFile({ fileName: outPath }).then(() => outPath);
}

function addSlideHeader(slide, title, subtitle) {
  slide.addShape('rect', { x: 0, y: 0, w: 13.33, h: 1.0, fill: { color: COLORS.dark } });
  slide.addText(title, { x: 0.5, y: 0.1, w: 12, h: 0.5, fontSize: 22, bold: true, color: COLORS.white, fontFace: 'Arial' });
  slide.addText(subtitle, { x: 0.5, y: 0.55, w: 12, h: 0.35, fontSize: 11, color: COLORS.light, fontFace: 'Arial', italic: true });
}

// ── CLI ──
function run(argv) {
  let inputPath = '';
  let outputPath = '';
  let jsonMode = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') { jsonMode = true; continue; }
    if (a === '--input' && i + 1 < argv.length) { inputPath = argv[++i]; continue; }
    if (a === '--output' && i + 1 < argv.length) { outputPath = argv[++i]; continue; }
  }

  // positional fallback
  if (!inputPath && argv.length > 0 && !argv[0].startsWith('--')) inputPath = argv[0];
  if (!outputPath && argv.length > 1 && !argv[1].startsWith('--')) outputPath = argv[1];

  try {
    if (!inputPath) throw new Error('--input <file> required');
    generatePresentation(inputPath, outputPath).then(outFile => {
      if (jsonMode) console.log(JSON.stringify({ ok: true, output: path.resolve(outFile) }));
      else console.log(`Presentation generated: ${path.resolve(outFile)}`);
    }).catch(err => {
      if (jsonMode) console.log(JSON.stringify({ ok: false, error: err.message }));
      else { console.error(`Error: ${err.message}`); process.exitCode = 1; }
    });
  } catch (err) {
    if (jsonMode) console.log(JSON.stringify({ ok: false, error: err.message }));
    else console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  }
}

module.exports = { run, generatePresentation };

if (require.main === module) {
  run(process.argv.slice(2));
}
