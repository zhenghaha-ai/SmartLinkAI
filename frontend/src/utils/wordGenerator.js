import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  Header, Footer, PageNumber,
} from 'docx'

// A4 页面，页边距 20mm（1134 DXA）
const PAGE_W    = 11906
const PAGE_H    = 16838
const MARGIN    = 1134
const CONTENT_W = PAGE_W - MARGIN * 2   // 9638 DXA

const B = (sz = 4) => ({ style: BorderStyle.SINGLE, size: sz, color: 'auto' })
const NONE = () => ({ style: BorderStyle.NONE, size: 0, color: 'auto' })

const TBL_BORDERS = { top: B(), bottom: B(), left: B(), right: B(), insideH: B(), insideV: B() }
const NO_BORDERS  = { top: NONE(), bottom: NONE(), left: NONE(), right: NONE(), insideH: NONE(), insideV: NONE() }

// Times New Roman, 12pt
function r(text, bold = false, size = 24) {
  return new TextRun({ text: String(text ?? ''), bold, size, font: 'Times New Roman' })
}

// 节标题段落（表格外，加粗）
function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 180, after: 60 },
    children: [r(text, true)],
  })
}

// 字段行：加粗标签 + 普通值（同段落）
function fieldPara(label, value) {
  const val = Array.isArray(value) ? value.join('\n') : (value || 'N/A')
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    children: [r(label, true), r(val, false)],
  })
}

// 每个 section 的单格全宽边框表格
function sectionTable(paragraphs) {
  return new Table({
    width:        { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    borders:      TBL_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width:   { size: CONTENT_W, type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 108, right: 108 },
            verticalAlign: VerticalAlign.TOP,
            children: paragraphs,
          }),
        ],
      }),
    ],
  })
}

// Section 3 成分表格（多列）
function ingredientTable(ingredients) {
  const cols = [500, 5650, 1800, 1488]   // sum = 9438（留 200 给内边距）
  const hdr  = ['No.', 'Component', 'Percentage by weight', 'CAS #']

  const mkCell = (text, bold, colIdx) =>
    new TableCell({
      width:   { size: cols[colIdx], type: WidthType.DXA },
      margins: { top: 40, bottom: 40, left: 80, right: 80 },
      children: [new Paragraph({ children: [r(text, bold)] })],
    })

  const headerRow = new TableRow({
    children: hdr.map((h, i) => mkCell(h, true, i)),
  })

  const dataRows = (ingredients || []).map((ing, idx) =>
    new TableRow({
      children: [
        mkCell(String(ing.no ?? idx + 1), false, 0),
        mkCell(ing.component || '', false, 1),
        mkCell(ing.percentage || '', false, 2),
        mkCell(ing.casNumber || 'N/A', false, 3),
      ],
    })
  )

  return new Table({
    width:        { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: cols,
    borders:      TBL_BORDERS,
    rows:         [headerRow, ...dataRows],
  })
}

export async function generateWord(sds) {
  const s1  = sds.section1  || {}
  const s2  = sds.section2  || {}
  const s3  = sds.section3  || {}
  const s4  = sds.section4  || {}
  const s5  = sds.section5  || {}
  const s6  = sds.section6  || {}
  const s7  = sds.section7  || {}
  const s8  = sds.section8  || {}
  const s9  = sds.section9  || {}
  const s10 = sds.section10 || {}
  const s11 = sds.section11 || {}
  const s12 = sds.section12 || {}
  const s13 = sds.section13 || {}
  const s14 = sds.section14 || {}
  const s15 = sds.section15 || {}
  const s16 = sds.section16 || {}

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size:   { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN, bottom: 1021, left: MARGIN, right: MARGIN },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [r('Safety Data Sheet', false, 20)],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              r('Page ', false, 18),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Times New Roman' }),
              r(' of ', false, 18),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: 'Times New Roman' }),
            ],
          })],
        }),
      },
      children: [
        // ── 封面标题 ──────────────────────────────────────
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [r(sds.productName || 'Product', true, 44)],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [r('Safety Data Sheet', false, 24)],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [r(`Issue Date: ${sds.issueDate || new Date().toISOString().slice(0, 10)}`, false, 24)],
        }),

        // ── Section 1 ─────────────────────────────────────
        sectionHeading('1.  Identification of the substance/mixture and of the company/undertaking'),
        sectionTable([
          fieldPara('Product identifier：', ''),
          fieldPara('Name of the item: ', s1.productIdentifier || sds.productName),
          fieldPara('Name of Brand：', sds.brandName || s1.brandName),
          fieldPara('Recommended use of the product and restrictions on use', ''),
          fieldPara('Relevant identified uses：', s1.recommendedUse),
          fieldPara('Details of the supplier of the Safety Data Sheet', ''),
          fieldPara('Name of the company：', s1.companyName),
          fieldPara('Address of the company：', s1.companyAddress),
          fieldPara('Telephone number：', s1.telephone),
          fieldPara('Emergency phone number：', s1.emergencyPhone),
        ]),

        // ── Section 2 ─────────────────────────────────────
        sectionHeading('2.  Hazards Identification'),
        sectionTable([
          fieldPara('Hazard classification according to 29 CFR 1910.1200：', s2.hazardClassification),
          fieldPara('Signal word：', s2.signalWord),
          fieldPara('Hazard statements：', Array.isArray(s2.hazardStatements) ? s2.hazardStatements.join('\n') : s2.hazardStatements),
          fieldPara('Precautionary statements：', Array.isArray(s2.precautionaryStatements) ? s2.precautionaryStatements.join('\n') : s2.precautionaryStatements),
          fieldPara('Response：', s2.response),
          fieldPara('Storage：', s2.storage),
          fieldPara('Disposal：', s2.disposal),
        ]),

        // ── Section 3 ─────────────────────────────────────
        sectionHeading('3.  Composition/information on ingredients'),
        ...(s3.ingredients?.length
          ? [ingredientTable(s3.ingredients)]
          : [sectionTable([fieldPara('', 'No ingredients specified.')])]
        ),

        // ── Section 4 ─────────────────────────────────────
        sectionHeading('4.  First aid measures'),
        sectionTable([
          fieldPara('Skin contact：', s4.skinContact),
          fieldPara('Eyes contact：', s4.eyeContact),
          fieldPara('Inhalation：', s4.inhalation),
          fieldPara('Ingestion：', s4.ingestion),
        ]),

        // ── Section 5 ─────────────────────────────────────
        sectionHeading('5.  Firefighting measures'),
        sectionTable([
          fieldPara('Extinguishing agent：', s5.extinguishingAgent),
          fieldPara('Special danger：', s5.specialDanger),
          fieldPara('Protective measures：', s5.protectiveMeasures),
        ]),

        // ── Section 6 ─────────────────────────────────────
        sectionHeading('6.  Accidental release measures'),
        sectionTable([
          fieldPara('Personal precautions, protective equipment and emergency procedures：', s6.personalPrecautions),
          fieldPara('Environmental precautions：', s6.environmentalPrecautions),
          fieldPara('Methods and materials for containment and cleaning up：', s6.containmentMethods),
        ]),

        // ── Section 7 ─────────────────────────────────────
        sectionHeading('7.  Handling and storage'),
        sectionTable([
          fieldPara('Precautions for safe handling：', s7.safeHandling),
          fieldPara('Conditions for safe storage, including any incompatibilities：', s7.storageConditions),
        ]),

        // ── Section 8 ─────────────────────────────────────
        sectionHeading('8.  Exposure controls/personal protection'),
        sectionTable([
          fieldPara('Control parameters', ''),
          fieldPara('Occupational Exposure limit values：', s8.occupationalExposureLimit),
          fieldPara('Biological limit values：', s8.biologicalLimitValues),
          fieldPara('Appropriate engineering controls', ''),
          fieldPara('', s8.engineeringControls),
          fieldPara('Individual protection measures, such as personal protective equipment (PPE)', ''),
          fieldPara('Eye/face protection：', s8.eyeFaceProtection),
          fieldPara('Skin protection：', s8.skinProtection),
          fieldPara('Respiratory protection：', s8.respiratoryProtection),
          fieldPara('Thermal hazards：', s8.thermalHazards),
        ]),

        // ── Section 9 ─────────────────────────────────────
        sectionHeading('9.  Physical and chemical properties'),
        sectionTable([
          fieldPara('Appearance：', s9.appearance),
          fieldPara('Colour：', s9.colour + '  Odour：' + (s9.odour || 'N/A')),
          fieldPara('PH：', s9.pH + '  Boiling point/range：' + (s9.boilingPoint || 'N/A')),
          fieldPara('Melting point/range：', s9.meltingPoint + '  Flashpoint：' + (s9.flashPoint || 'N/A')),
          fieldPara('Density：', s9.density + '  Viscosity：' + (s9.viscosity || 'N/A')),
          fieldPara('Oxidising properties：', s9.oxidising + '  Vapour pressure：' + (s9.vapourPressure || 'N/A')),
          fieldPara('Solubility in water：', s9.solubility + '  Vapour density：' + (s9.vapourDensity || 'N/A')),
          fieldPara('Ignition temperature：', s9.ignitionTemperature + '  Evaporation rate：' + (s9.evaporationRate || 'N/A') + '  UEL：' + (s9.UEL || 'N/A')),
        ]),

        // ── Section 10 ────────────────────────────────────
        sectionHeading('10.  Stability and reactivity'),
        sectionTable([
          fieldPara('Stability：', s10.stability),
          fieldPara('Distribution of Ban：', s10.incompatibleMaterials),
          fieldPara('Hazardous Polymerization：', s10.hazardousPolymerization),
          fieldPara('Possibility of hazardous reactions：', s10.possibilityOfHazardousReactions),
        ]),

        // ── Section 11 ────────────────────────────────────
        sectionHeading('11.  Toxicological information'),
        sectionTable([
          fieldPara('Acute Toxicity：', s11.acuteToxicity),
          fieldPara('Sub-acute and Chronic Toxicity：', s11.chronicToxicity),
          fieldPara('Irritation：', s11.irritation),
          fieldPara('Sensitization：', s11.sensitization),
          fieldPara('Mutagenicity：', s11.mutagenicity),
          fieldPara('Carcinogenicity：', s11.carcinogenicity),
        ]),

        // ── Section 12 ────────────────────────────────────
        sectionHeading('12.  Ecological information'),
        sectionTable([
          fieldPara('Ecological toxicity：', s12.ecologicalToxicity),
          fieldPara('Persistence and degradation：', s12.persistenceDegradation),
          fieldPara('Potential bioaccumulation：', s12.bioaccumulation),
          fieldPara('Migration in soil：', s12.soilMigration),
          fieldPara('Other harmful effects：', s12.otherHarmfulEffects),
        ]),

        // ── Section 13 ────────────────────────────────────
        sectionHeading('13.  Disposal considerations'),
        sectionTable([
          fieldPara('Disposal method：', s13.disposalMethod),
          fieldPara('Disposal considerations：', s13.disposalConsiderations),
        ]),

        // ── Section 14 ────────────────────────────────────
        sectionHeading('14.  Transport information'),
        sectionTable([
          fieldPara('', s14.iataInfo),
          fieldPara('UN number：', s14.unNumber),
          fieldPara('Risk classification：', s14.riskClassification),
          fieldPara('Land Transport ADR/RID：', s14.landTransport),
          fieldPara('Maritime Transport IMO/IMDG：', s14.maritimeTransport),
          fieldPara('Air Transport IATA/ICAO：', s14.airTransport),
          fieldPara('Packaging Information：', s14.packagingInfo),
          fieldPara('Transport Fashion：', s14.transportFashion),
          fieldPara('Transport Attentions：', s14.transportAttentions),
        ]),

        // ── Section 15 ────────────────────────────────────
        sectionHeading('15.  Regulatory information'),
        sectionTable([
          fieldPara('Regulatory Information：', s15.regulatoryInfo),
        ]),

        // ── Section 16 ────────────────────────────────────
        sectionHeading('16.  Other information'),
        sectionTable([
          fieldPara('References：', s16.references),
          fieldPara('Disclaimer：', s16.disclaimer),
        ]),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  const name = `${(sds.productName || 'SDS').replace(/[^\w\s-]/g, '').trim()}-SDS.docx`
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = name
  document.body.appendChild(a); a.click()
  document.body.removeChild(a); URL.revokeObjectURL(url)
}
