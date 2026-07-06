// cariak-pi report — DOCX Report Generator
// Generates professional DOCX documents from research data using docx v9.7.1.
// Entry: npx cariak-pi report --input <json> --template <name> --output <path.docx>

'use strict';

const fs = require('fs');
const path = require('path');
const docx = require('docx');

// ── docx imports ──────────────────────────────────────────────────────────
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, ShadingType,
  PageBreak, PageNumber, Header, Footer,
  convertInchesToTwip, WidthType, TableLayoutType, VerticalAlign,
} = docx;

// ── constants ─────────────────────────────────────────────────────────────
const INCH = convertInchesToTwip;
const COLORS = {
  dark: '1B3A5C',
  mid: '2B579A',
  light: 'D6E4F0',
  grayLight: 'F2F2F2',
  grayMid: 'D9D9D9',
  white: 'FFFFFF',
  black: '000000',
  red: 'C00000',
};

const FONT_BODY = 'Arial';
const FONT_CODE = 'Consolas';

// ── helpers ───────────────────────────────────────────────────────────────

function heading(text, level = HeadingLevel.HEADING_1) {
  const sizes = { 1: 32, 2: 26, 3: 24, 4: 22 };
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 400 : 280, after: 200 },
    children: [new TextRun({ text, font: FONT_BODY, bold: true, size: sizes[level] || 24, color: COLORS.dark })],
  });
}

function para(text, opts = {}) {
  const { bold, indent, alignment, size = 22, center } = opts;
  const runs = [];
  if (typeof text === 'string') {
    runs.push(new TextRun({ text, font: FONT_BODY, size, bold: bold || false }));
  } else if (Array.isArray(text)) {
    text.forEach((t) => {
      runs.push(new TextRun({
        text: t.text, font: t.font || FONT_BODY, size: t.size || size,
        bold: t.bold || false, italics: t.italics || false,
        color: t.color, superScript: t.superScript,
      }));
    });
  }
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 276 },
    alignment: center ? AlignmentType.CENTER : (alignment || AlignmentType.JUSTIFIED),
    indent: indent ? { firstLine: INCH(0.5) } : undefined,
    children: runs,
  });
}

function bullet(text, level = 0) {
  const indent = 720 + level * 360; // twips
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: indent, hanging: 360 },
    children: [
      new TextRun({ text: '•  ', font: FONT_BODY, size: 22 }),
      new TextRun({ text: String(text), font: FONT_BODY, size: 22 }),
    ],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function spacer(lines = 1) {
  return new Paragraph({ spacing: { before: lines * 200, after: lines * 200 }, children: [] });
}

function boldLead(lead, rest) {
  return para([
    { text: lead, bold: true },
    { text: rest, bold: false },
  ]);
}

function cell(text, opts = {}) {
  const { shading, bold, alignment = AlignmentType.LEFT, colSpan, size = 20, width } = opts;
  const runs = Array.isArray(text)
    ? text.map(t => new TextRun({ text: t.text, font: FONT_BODY, size: t.size || size, bold: t.bold || bold || false, color: t.color }))
    : [new TextRun({ text: String(text || ''), font: FONT_BODY, size, bold: bold || false })];
  return new TableCell({
    shading: shading ? { type: ShadingType.SOLID, color: shading, fill: shading } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    columnSpan: colSpan,
    children: [
      new Paragraph({ alignment, spacing: { before: 40, after: 40 }, children: runs }),
    ],
  });
}

function makeTable(headers, rows, colWidths) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      cell(h, { shading: COLORS.mid, bold: true, alignment: AlignmentType.CENTER, size: 18, width: colWidths[i] })
    ),
  });
  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((c, ci) =>
        cell(c, {
          shading: ri % 2 === 0 ? COLORS.white : COLORS.grayLight,
          size: 18,
          alignment: typeof c === 'number' ? AlignmentType.CENTER : AlignmentType.LEFT,
          width: colWidths[ci],
        })
      ),
    })
  );
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
    layout: TableLayoutType.FIXED,
  });
}

function defaultHeader(title) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.dark } },
        children: [
          new TextRun({ text: title || 'Cariak Research Report', font: FONT_BODY, size: 16, bold: true, color: COLORS.dark }),
          new TextRun({ text: '  |  ', font: FONT_BODY, size: 16, color: COLORS.grayMid }),
          new TextRun({ text: new Date().toISOString().slice(0, 10), font: FONT_BODY, size: 16, italics: true, color: COLORS.mid }),
        ],
      }),
    ],
  });
}

function defaultFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.dark } },
        children: [
          new TextRun({ text: 'Generated by Cariak  |  Page ', font: FONT_BODY, size: 16, color: COLORS.dark }),
          new TextRun({ children: [PageNumber.CURRENT], font: FONT_BODY, size: 16, color: COLORS.dark }),
          new TextRun({ text: ' of ', font: FONT_BODY, size: 16, color: COLORS.dark }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT_BODY, size: 16, color: COLORS.dark }),
        ],
      }),
    ],
  });
}

// ── cover page ────────────────────────────────────────────────────────────

function coverPage(title, subtitle, date, author) {
  return [
    spacer(6),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: '[ CARIAK RESEARCH ]', font: FONT_BODY, size: 28, color: COLORS.grayMid, italics: true })],
    }),
    spacer(3),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: title || 'Research Report', font: FONT_BODY, size: 52, bold: true, color: COLORS.dark })],
    }),
    spacer(1),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: subtitle || '', font: FONT_BODY, size: 36, color: COLORS.mid })],
    }),
    spacer(4),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `${date || new Date().toISOString().slice(0, 10)}${author ? '  |  ' + author : ''}`, font: FONT_BODY, size: 24, color: COLORS.dark })],
    }),
    spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: 'Prepared by: Cariak Deep Research Agent', font: FONT_BODY, size: 24, color: COLORS.dark })],
    }),
    spacer(7),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.DOUBLE, size: 3, color: COLORS.red }, bottom: { style: BorderStyle.DOUBLE, size: 3, color: COLORS.red }, left: { style: BorderStyle.DOUBLE, size: 3, color: COLORS.red }, right: { style: BorderStyle.DOUBLE, size: 3, color: COLORS.red } },
      spacing: { before: 200, after: 200 },
      children: [new TextRun({ text: 'GENERATED BY CARIAK — AI RESEARCH AGENT', font: FONT_BODY, size: 22, bold: true, color: COLORS.red })],
    }),
  ];
}

// ── json data loading ─────────────────────────────────────────────────────

function loadInput(filePath) {
  if (!filePath) throw new Error('--input <file> is required');
  const fp = path.resolve(filePath);
  if (!fs.existsSync(fp)) throw new Error(`Input file not found: ${fp}`);
  const raw = fs.readFileSync(fp, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in input file: ${e.message}`);
  }
}

// ── template dispatcher ───────────────────────────────────────────────────

/**
 * Generate document sections for a given template name.
 * Returns { sections, title, subtitle, applyCover }.
 */
function dispatchTemplate(templateName, data) {
  const sections = [];
  let title = 'Research Report';
  let subtitle = '';
  let applyCover = true;

  switch (templateName) {
    case 'research-report':
      return buildResearchReport(data);

    case 'prd':
      subtitle = data.product_name || data.title || '';
      title = `${subtitle} — Product Requirements Document`;
      sections.push(heading('1. Introduction'));
      sections.push(para(data.problem_statement || data.introduction || ''));
      sections.push(heading('2. Objectives', HeadingLevel.HEADING_2));
      sections.push(para(data.vision || data.objectives || ''));
      sections.push(heading('3. Stakeholders', HeadingLevel.HEADING_2));
      sections.push(para(data.stakeholders || ''));
      sections.push(heading('4. Functional Requirements', HeadingLevel.HEADING_2));
      (data.functional_requirements || data.requirements || []).forEach(r => {
        sections.push(bullet(typeof r === 'string' ? r : r.text || r.description || JSON.stringify(r)));
      });
      sections.push(heading('5. Non-Functional Requirements', HeadingLevel.HEADING_2));
      sections.push(para(data.non_functional_requirements || data.nfr || ''));
      sections.push(heading('6. Milestones', HeadingLevel.HEADING_2));
      if (data.milestones && Array.isArray(data.milestones)) {
        sections.push(makeTable(
          ['Milestone', 'Target Date', 'Definition of Done'],
          data.milestones.map(m => [m.name || '', m.date || '', m.dod || '']),
          [34, 33, 33]
        ));
      }
      break;

    case 'tech-spec':
      title = `${data.title || 'System'} — Technical Specification`;
      sections.push(heading('1. Overview'));
      sections.push(para(data.overview || data.description || ''));
      sections.push(heading('2. Architecture', HeadingLevel.HEADING_2));
      sections.push(para(data.architecture || data.design || ''));
      sections.push(heading('3. Components', HeadingLevel.HEADING_2));
      (data.components || []).forEach(c => {
        sections.push(heading(c.name || 'Component', HeadingLevel.HEADING_3));
        sections.push(para(c.description || c.detail || ''));
      });
      sections.push(heading('4. API / Interfaces', HeadingLevel.HEADING_2));
      sections.push(para(data.api || data.interfaces || ''));
      sections.push(heading('5. Data Model', HeadingLevel.HEADING_2));
      sections.push(para(data.data_model || data.schema || ''));
      break;

    case 'adr':
      title = `ADR-${data.number || 'NNN'}: ${data.decision_title || data.title || ''}`;
      sections.push(heading('1. Context'));
      sections.push(para(data.context || data.background || ''));
      sections.push(heading('2. Decision'));
      sections.push(para(data.decision || data.description || ''));
      sections.push(heading('3. Consequences', HeadingLevel.HEADING_2));
      (data.consequences || data.positive || []).forEach(c => sections.push(bullet(c)));
      sections.push(heading('4. Alternatives Considered', HeadingLevel.HEADING_2));
      (data.alternatives || []).forEach(a => {
        sections.push(boldLead(`${a.name || a.title}: `, a.description || a.reason || ''));
      });
      break;

    case 'competitive-analysis':
      title = `Competitive Analysis: ${data.market_domain || data.domain || ''}`;
      sections.push(heading('1. Overview'));
      sections.push(para(data.overview || data.summary || ''));
      if (data.competitors && Array.isArray(data.competitors)) {
        sections.push(heading('2. Feature Comparison Matrix', HeadingLevel.HEADING_2));
        const features = data.features || ['Feature A', 'Feature B', 'Feature C', 'Feature D'];
        const headerRow = ['Feature', ...data.competitors.map(c => c.name || 'Competitor')];
        const dataRows = features.map(f => {
          const row = [typeof f === 'string' ? f : f.name];
          data.competitors.forEach(c => {
            const vals = c.features || {};
            const key = typeof f === 'string' ? f : f.key;
            row.push(vals[key] || '');
          });
          return row;
        });
        const totalCols = headerRow.length;
        sections.push(makeTable(headerRow, dataRows, new Array(totalCols).fill(Math.floor(100 / totalCols))));
      }
      sections.push(heading('3. Strengths & Weaknesses', HeadingLevel.HEADING_2));
      (data.competitors || []).forEach(c => {
        sections.push(boldLead(`${c.name}: `, c.strengths || c.weaknesses || ''));
      });
      break;

    case 'risk-register':
      title = `Risk Register: ${data.project_name || data.title || ''}`;
      sections.push(heading('1. Risk Register'));
      if (data.risks && Array.isArray(data.risks)) {
        sections.push(makeTable(
          ['ID', 'Risk', 'Probability', 'Impact', 'Mitigation'],
          data.risks.map((r, i) => [r.id || `R${i + 1}`, r.description || r.risk || '', r.probability || '', r.impact || '', r.mitigation || '']),
          [8, 32, 16, 14, 30]
        ));
      }
      break;

    case 'literature-review':
      title = `Literature Review: ${data.topic || data.title || ''}`;
      sections.push(heading('1. Introduction'));
      sections.push(para(data.introduction || data.background || ''));
      sections.push(heading('2. Literature Survey', HeadingLevel.HEADING_2));
      (data.papers || data.sources || []).forEach(p => {
        sections.push(heading(p.title || 'Paper', HeadingLevel.HEADING_3));
        sections.push(para(p.summary || p.abstract || p.description || ''));
      });
      sections.push(heading('3. Synthesis', HeadingLevel.HEADING_2));
      sections.push(para(data.synthesis || data.findings || ''));
      break;

    case 'experiment-design':
      title = `Experiment Design: ${data.experiment_title || data.title || ''}`;
      sections.push(heading('1. Research Question'));
      sections.push(para(data.research_question || data.question || ''));
      sections.push(heading('2. Hypothesis', HeadingLevel.HEADING_2));
      sections.push(para(`H1: ${data.hypothesis_alt || data.hypothesis || ''}`));
      sections.push(para(`H0: ${data.hypothesis_null || data.null_hypothesis || ''}`));
      sections.push(heading('3. Methodology', HeadingLevel.HEADING_2));
      sections.push(para(data.methodology || data.method || ''));
      sections.push(heading('4. Timeline', HeadingLevel.HEADING_2));
      if (data.phases && Array.isArray(data.phases)) {
        sections.push(makeTable(
          ['Phase', 'Activity', 'Duration'],
          data.phases.map(p => [p.phase || p.name || '', p.activity || '', p.duration || '']),
          [15, 55, 30]
        ));
      }
      break;

    case 'implementation-roadmap':
      title = `Implementation Roadmap: ${data.project_name || data.title || ''}`;
      sections.push(heading('1. Executive Summary'));
      sections.push(para(data.summary || data.overview || ''));
      sections.push(heading('2. Phases', HeadingLevel.HEADING_2));
      (data.phases || []).forEach(p => {
        sections.push(heading(`${p.name || p.phase || 'Phase'}`, HeadingLevel.HEADING_3));
        sections.push(para(p.description || p.detail || ''));
        if (p.tasks && Array.isArray(p.tasks)) {
          sections.push(makeTable(
            ['Task', 'Owner', 'Duration', 'Status'],
            p.tasks.map(t => [t.task || t.name || '', t.owner || '', t.duration || '', t.status || '']),
            [40, 20, 20, 20]
          ));
        }
      });
      sections.push(heading('3. Milestones', HeadingLevel.HEADING_2));
      if (data.milestones && Array.isArray(data.milestones)) {
        sections.push(makeTable(
          ['Milestone', 'Date', 'Deliverable'],
          data.milestones.map(m => [m.name || '', m.date || '', m.deliverable || '']),
          [34, 33, 33]
        ));
      }
      break;

    case 'research-proposal':
      title = data.proposal_title || data.title || 'Research Proposal';
      sections.push(heading('1. Research Question'));
      sections.push(para(data.research_question || data.question || ''));
      sections.push(heading('2. Background & Significance', HeadingLevel.HEADING_2));
      sections.push(para(data.background || data.significance || ''));
      sections.push(heading('3. Literature Context', HeadingLevel.HEADING_2));
      sections.push(para(data.literature || data.context || ''));
      sections.push(heading('4. Hypothesis', HeadingLevel.HEADING_2));
      sections.push(para(`H1: ${data.hypothesis_alt || ''}`));
      sections.push(para(`H0: ${data.hypothesis_null || ''}`));
      sections.push(heading('5. Methodology', HeadingLevel.HEADING_2));
      sections.push(para(data.methodology || ''));
      sections.push(heading('6. Timeline', HeadingLevel.HEADING_2));
      if (data.phases && Array.isArray(data.phases)) {
        sections.push(makeTable(
          ['Phase', 'Activity', 'Duration'],
          data.phases.map(p => [p.phase || '', p.activity || '', p.duration || '']),
          [15, 55, 30]
        ));
      }
      sections.push(heading('7. Budget', HeadingLevel.HEADING_2));
      if (data.budget && Array.isArray(data.budget)) {
        sections.push(makeTable(
          ['Item', 'Cost'],
          data.budget.map(b => [b.item || b.name || '', b.cost || b.amount || '']),
          [60, 40]
        ));
      }
      break;

    case 'feasibility-study':
      title = `Feasibility Study: ${data.project_name || data.title || ''}`;
      sections.push(heading('1. Executive Summary'));
      sections.push(para(data.summary || data.overview || ''));
      sections.push(heading('2. Technical Feasibility', HeadingLevel.HEADING_2));
      sections.push(para(data.technical || data.tech_feasibility || ''));
      sections.push(heading('3. Economic Feasibility', HeadingLevel.HEADING_2));
      sections.push(para(data.economic || data.financial || ''));
      sections.push(heading('4. Legal Feasibility', HeadingLevel.HEADING_2));
      sections.push(para(data.legal || data.regulatory || ''));
      sections.push(heading('5. Operational Feasibility', HeadingLevel.HEADING_2));
      sections.push(para(data.operational || ''));
      sections.push(heading('6. Schedule Feasibility', HeadingLevel.HEADING_2));
      sections.push(para(data.schedule || data.timeline || ''));
      break;

    case 'technical-report':
      title = data.title || 'Technical Report';
      sections.push(heading('1. Introduction'));
      sections.push(para(data.introduction || data.background || ''));
      sections.push(heading('2. Methodology', HeadingLevel.HEADING_2));
      sections.push(para(data.methodology || data.approach || ''));
      sections.push(heading('3. Results', HeadingLevel.HEADING_2));
      sections.push(para(data.results || data.findings || ''));
      sections.push(heading('4. Discussion', HeadingLevel.HEADING_2));
      sections.push(para(data.discussion || data.analysis || ''));
      sections.push(heading('5. Conclusion', HeadingLevel.HEADING_2));
      sections.push(para(data.conclusion || ''));
      break;

    case 'recommendation-report':
      title = data.title || 'Recommendation Report';
      sections.push(heading('1. Executive Summary'));
      sections.push(para(data.summary || data.overview || ''));
      sections.push(heading('2. Options Evaluated', HeadingLevel.HEADING_2));
      (data.options || []).forEach(o => {
        sections.push(boldLead(`${o.name || o.title}: `, o.description || ''));
        if (o.pros) sections.push(para(`Pros: ${Array.isArray(o.pros) ? o.pros.join('; ') : o.pros}`));
        if (o.cons) sections.push(para(`Cons: ${Array.isArray(o.cons) ? o.cons.join('; ') : o.cons}`));
      });
      sections.push(heading('3. Recommendation', HeadingLevel.HEADING_2));
      sections.push(para(data.recommendation || data.decision || ''));
      sections.push(heading('4. Implementation Steps', HeadingLevel.HEADING_2));
      (data.steps || data.next_steps || []).forEach(s => sections.push(bullet(s)));
      break;

    default:
      // fallback to research-report
      return buildResearchReport(data);
  }

  return { sections, title, subtitle, applyCover };
}

// ── research-report builder ────────────────────────────────────────────────

function buildResearchReport(data) {
  const sections = [];
  const title = data.title || data.report_title || 'Research Report';
  const subtitle = data.subtitle || '';

  // Executive Summary
  sections.push(heading('Executive Summary'));
  sections.push(para(data.executive_summary || data.summary || data.abstract || ''));

  // Research Questions Answered
  if (data.research_questions || data.questions) {
    sections.push(heading('Research Questions Answered'));
    (data.research_questions || data.questions || []).forEach((rq, i) => {
      sections.push(heading(`RQ-${i + 1}: ${rq.question || rq.text || rq.title || ''}`, HeadingLevel.HEADING_2));
      sections.push(boldLead('Finding: ', rq.finding || rq.answer || rq.result || ''));
      if (rq.evidence && Array.isArray(rq.evidence)) {
        sections.push(boldLead('Evidence:', ''));
        rq.evidence.forEach(e => sections.push(bullet(typeof e === 'string' ? e : e.text || e.claim || '')));
      }
      if (rq.contradictions) {
        sections.push(boldLead('Contradictions: ', rq.contradictions));
      }
      if (rq.confidence) {
        sections.push(boldLead('Confidence: ', `${rq.confidence}`));
      }
    });
  }

  // Findings (fallback for non-RQ-structured data)
  if (data.findings && Array.isArray(data.findings) && !(data.research_questions || data.questions)) {
    sections.push(heading('Key Findings'));
    data.findings.forEach(f => {
      sections.push(boldLead(
        f.title || f.heading || '',
        f.text || f.description || f.detail || ''
      ));
    });
  }

  // Contradictions
  if (data.contradictions && Array.isArray(data.contradictions) && data.contradictions.length > 0) {
    sections.push(heading('Contradictions & Resolutions'));
    data.contradictions.forEach(c => {
      sections.push(boldLead(`${c.source_a || 'Source A'} vs ${c.source_b || 'Source B'}: `, c.resolution || c.description || ''));
    });
  }

  // Source Diversity
  if (data.source_diversity || data.sources) {
    sections.push(heading('Source Diversity'));
    const sd = data.source_diversity || {};
    sections.push(bullet(`Internet sources: ${sd.internet || 0}`));
    sections.push(bullet(`Social sources: ${sd.social || 0}`));
    sections.push(bullet(`Academic sources: ${sd.academic || 0}`));
    sections.push(bullet(`News sources: ${sd.news || 0}`));
    sections.push(bullet(`Market sources: ${sd.market || 0}`));
    if (sd.total || data.total_sources) {
      sections.push(bullet(`Total unique sources: ${sd.total || data.total_sources}`));
    }
  }

  // Gaps
  if (data.gaps && Array.isArray(data.gaps) && data.gaps.length > 0) {
    sections.push(heading('Gaps Identified'));
    data.gaps.forEach(g => sections.push(bullet(typeof g === 'string' ? g : g.text || g.description || '')));
  }

  // References
  if (data.sources && Array.isArray(data.sources)) {
    sections.push(heading('References'));
    data.sources.forEach((s, i) => {
      const ref = s.title || s.name || s.citation || '';
      const url = s.url || '';
      sections.push(para(`[${i + 1}] ${ref}${url ? ' — ' + url : ''}`, { size: 20 }));
    });
  }

  // Confidence Score
  if (data.confidence || data.confidence_score) {
    sections.push(heading('Confidence Score'));
    sections.push(para(`Overall Confidence: ${data.confidence || data.confidence_score}`));
    if (data.confidence_details) {
      sections.push(para(data.confidence_details));
    }
  }

  return { sections, title, subtitle, applyCover: true };
}

// ── main report generation ─────────────────────────────────────────────────

function generateReport(inputPath, templateName, outputPath) {
  const data = loadInput(inputPath);
  const { sections, title, subtitle, applyCover } = dispatchTemplate(templateName, data);

  const docSections = [];

  if (applyCover) {
    const cover = coverPage(
      title,
      subtitle,
      data.date || data.generated_at || new Date().toISOString().slice(0, 10),
      data.author || data.prepared_by || ''
    );
    docSections.push(...cover);
    docSections.push(pageBreak());
  }

  docSections.push(...sections);

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: INCH(1), bottom: INCH(1), left: INCH(1.2), right: INCH(1) },
        },
      },
      headers: { default: defaultHeader(title) },
      footers: { default: defaultFooter() },
      children: docSections,
    }],
  });

  const outPath = outputPath || `${(templateName || 'research-report').replace(/\s+/g, '-')}.docx`;
  return Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(outPath, buffer);
    return outPath;
  });
}

// ── CLI interface ──────────────────────────────────────────────────────────

function run(argv) {
  const flags = [];
  let inputPath = '';
  let templateName = 'research-report';
  let outputPath = '';
  let jsonMode = false;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') { jsonMode = true; continue; }
    if (a === '--input' && i + 1 < argv.length) { inputPath = argv[++i]; continue; }
    if (a === '--template' && i + 1 < argv.length) { templateName = argv[++i]; continue; }
    if (a === '--output' && i + 1 < argv.length) { outputPath = argv[++i]; continue; }
    flags.push(a);
  }

  // also support positional shorthand: first arg = input, second = template
  if (!inputPath && flags.length > 0) inputPath = flags[0];
  if (templateName === 'research-report' && flags.length > 1) templateName = flags[1];
  if (!outputPath && flags.length > 2) outputPath = flags[2];

  const VALID_TEMPLATES = [
    'research-report', 'prd', 'tech-spec', 'adr', 'competitive-analysis',
    'risk-register', 'literature-review', 'experiment-design',
    'implementation-roadmap', 'research-proposal', 'feasibility-study',
    'technical-report', 'recommendation-report',
  ];

  try {
    if (!inputPath) {
      throw new Error('--input <file> is required. Usage: npx cariak-pi report --input <references.json> --template <name> --output <out.docx>');
    }
    if (!VALID_TEMPLATES.includes(templateName)) {
      throw new Error(`Unknown template: "${templateName}". Valid: ${VALID_TEMPLATES.join(', ')}`);
    }

    const outFile = generateReport(inputPath, templateName, outputPath);
    outFile.then(fullPath => {
      if (jsonMode) {
        console.log(JSON.stringify({ ok: true, output: path.resolve(fullPath), template: templateName }));
      } else {
        console.log(`Report generated: ${path.resolve(fullPath)}`);
      }
    }).catch(err => {
      if (jsonMode) {
        console.log(JSON.stringify({ ok: false, error: err.message }));
      } else {
        console.error(`Error: ${err.message}`);
        process.exitCode = 1;
      }
    });
  } catch (err) {
    if (jsonMode) {
      console.log(JSON.stringify({ ok: false, error: err.message }));
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exitCode = 1;
  }
}

module.exports = { run, generateReport, VALID_TEMPLATES: [
  'research-report', 'prd', 'tech-spec', 'adr', 'competitive-analysis',
  'risk-register', 'literature-review', 'experiment-design',
  'implementation-roadmap', 'research-proposal', 'feasibility-study',
  'technical-report', 'recommendation-report',
] };

// direct execution
if (require.main === module) {
  run(process.argv.slice(2));
}
