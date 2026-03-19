import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, AlignmentType, WidthType, ShadingType
} from 'docx'

const HEADER_COLOR = '1F3864'
const HEADER_TEXT_COLOR = 'FFFFFF'
const ROW_ALT_COLOR = 'DCE6F1'

function sectionHeader(num, title) {
  return new Paragraph({
    children: [new TextRun({ text: `SECTION ${num}: ${title}`, bold: true, color: HEADER_TEXT_COLOR, size: 22 })],
    shading: { type: ShadingType.SOLID, color: HEADER_COLOR },
    spacing: { before: 240, after: 120 },
    indent: { left: 100 }
  })
}

function lv(label, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 20 }),
      new TextRun({ text: value || 'Not determined', size: 20 })
    ],
    spacing: { before: 60, after: 60 },
    indent: { left: 200 }
  })
}

function bold(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 20 })],
    indent: { left: 200 },
    spacing: { before: 80, after: 40 }
  })
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text: text || '', size: 20 })],
    bullet: { level: 0 },
    indent: { left: 400 },
    spacing: { before: 40, after: 40 }
  })
}

function buildIngredientsTable(ingredients) {
  const headers = ['Chemical Name', 'CAS Number', 'Concentration (%)']
  const headerRow = new TableRow({
    children: headers.map(h => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, color: HEADER_TEXT_COLOR, size: 18 })], alignment: AlignmentType.CENTER })],
      shading: { type: ShadingType.SOLID, color: HEADER_COLOR },
      width: { size: 33, type: WidthType.PERCENTAGE }
    }))
  })

  const rows = (ingredients || []).map((ing, idx) => new TableRow({
    children: [
      ing.name || ing.chemicalName || '',
      ing.cas || ing.casNumber || 'N/A',
      ing.percentage || ing.concentration || 'N/A'
    ].map(val => new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: String(val), size: 18 })], alignment: AlignmentType.CENTER })],
      shading: idx % 2 === 1 ? { type: ShadingType.SOLID, color: ROW_ALT_COLOR } : undefined,
      width: { size: 33, type: WidthType.PERCENTAGE }
    }))
  }))

  return new Table({
    rows: [headerRow, ...rows],
    width: { size: 100, type: WidthType.PERCENTAGE }
  })
}

export async function buildDocx(sds, formData) {
  const s1 = sds.section1 || {}
  const s2 = sds.section2 || {}
  const s3 = sds.section3 || {}
  const s4 = sds.section4 || {}
  const s5 = sds.section5 || {}
  const s6 = sds.section6 || {}
  const s7 = sds.section7 || {}
  const s8 = sds.section8 || {}
  const s9 = sds.section9 || {}
  const s10 = sds.section10 || {}
  const s11 = sds.section11 || {}
  const s12 = sds.section12 || {}
  const s13 = sds.section13 || {}
  const s14 = sds.section14 || {}
  const s15 = sds.section15 || {}
  const s16 = sds.section16 || {}
  const ppe = s8.personalProtectiveEquipment || {}
  const ps = s2.precautionaryStatements || {}

  const children = [
    new Paragraph({
      children: [new TextRun({ text: 'SAFETY DATA SHEET', bold: true, size: 36, color: HEADER_TEXT_COLOR })],
      shading: { type: ShadingType.SOLID, color: HEADER_COLOR },
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 }
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Complies with OSHA 29 CFR 1910.1200 (HazCom 2012)', size: 18, italics: true })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 300 }
    }),

    sectionHeader(1, 'IDENTIFICATION'),
    lv('Product Name', s1.productName || formData.productName),
    lv('Other Names / Synonyms', s1.otherNames),
    lv('Recommended Use', s1.recommendedUse),
    lv('Restricted Use', s1.restrictedUse),
    lv('Supplier Name', s1.supplierName || formData.companyName),
    lv('Supplier Address', s1.supplierAddress || formData.companyAddress),
    lv('Supplier Phone', s1.supplierPhone || formData.companyPhone),
    lv('Emergency Phone', s1.emergencyPhone || formData.emergencyPhone || 'CHEMTREC: 1-800-424-9300'),

    sectionHeader(2, 'HAZARD(S) IDENTIFICATION'),
    lv('GHS Classification', s2.classification),
    lv('Signal Word', s2.signalWord),
    bold('Hazard Statements:'),
    ...(s2.hazardStatements || []).map(bullet),
    bold('Precautionary Statements — Prevention:'),
    ...(ps.prevention || []).map(bullet),
    bold('Precautionary Statements — Response:'),
    ...(ps.response || []).map(bullet),
    bold('Precautionary Statements — Storage:'),
    ...(ps.storage || []).map(bullet),
    bold('Precautionary Statements — Disposal:'),
    ...(ps.disposal || []).map(bullet),
    lv('Hazard Pictograms', (s2.hazardPictograms || []).join(', ')),
    lv('Other Hazards', s2.otherHazards),

    sectionHeader(3, 'COMPOSITION / INFORMATION ON INGREDIENTS'),
    lv('Substance or Mixture', s3.substanceOrMixture),
    new Paragraph({ children: [new TextRun({ text: 'Ingredients:', bold: true, size: 20 })], indent: { left: 200 }, spacing: { before: 80, after: 80 } }),
    buildIngredientsTable(formData.ingredients),

    sectionHeader(4, 'FIRST-AID MEASURES'),
    lv('Eye Contact', s4.eyeContact),
    lv('Skin Contact', s4.skinContact),
    lv('Inhalation', s4.inhalation),
    lv('Ingestion', s4.ingestion),
    lv('Important Symptoms / Effects', s4.importantSymptomsEffects),
    lv('Immediate Medical Attention', s4.immediatemedicalAttention),

    sectionHeader(5, 'FIRE-FIGHTING MEASURES'),
    lv('Suitable Extinguishing Media', s5.suitableExtinguishingMedia),
    lv('Unsuitable Extinguishing Media', s5.unsuitableExtinguishingMedia),
    lv('Specific Hazards', s5.specificHazards),
    lv('Special Protective Equipment', s5.specialProtectiveEquipment),

    sectionHeader(6, 'ACCIDENTAL RELEASE MEASURES'),
    lv('Personal Precautions', s6.personalPrecautions),
    lv('Environmental Precautions', s6.environmentalPrecautions),
    lv('Containment and Cleanup', s6.containmentCleanup),
    lv('Reference to Other Sections', s6.referenceToOtherSections),

    sectionHeader(7, 'HANDLING AND STORAGE'),
    lv('Precautions for Safe Handling', s7.precautionsForSafeHandling),
    lv('Conditions for Safe Storage', s7.conditionsForSafeStorage),
    lv('Specific End Uses', s7.specificEndUses),

    sectionHeader(8, 'EXPOSURE CONTROLS / PERSONAL PROTECTION'),
    lv('Control Parameters / Exposure Limits', s8.controlParameters),
    lv('Engineering Controls', s8.engineeringControls),
    bold('Personal Protective Equipment:'),
    lv('Eye / Face Protection', ppe.eyeFace),
    lv('Skin Protection', ppe.skin),
    lv('Respiratory Protection', ppe.respiratory),
    lv('General Hygiene', ppe.general),

    sectionHeader(9, 'PHYSICAL AND CHEMICAL PROPERTIES'),
    lv('Appearance', s9.appearance),
    lv('Odor', s9.odor),
    lv('Odor Threshold', s9.odorThreshold),
    lv('pH', s9.pH),
    lv('Melting Point / Freezing Point', s9.meltingPoint),
    lv('Boiling Point / Range', s9.boilingPoint),
    lv('Flash Point', s9.flashPoint),
    lv('Evaporation Rate', s9.evaporationRate),
    lv('Flammability', s9.flammability),
    lv('Vapor Pressure', s9.vaporPressure),
    lv('Vapor Density', s9.vaporDensity),
    lv('Relative Density', s9.relativeDensity),
    lv('Solubility', s9.solubility),
    lv('Partition Coefficient (n-octanol/water)', s9.partitionCoefficient),
    lv('Auto-ignition Temperature', s9.autoIgnitionTemp),
    lv('Decomposition Temperature', s9.decompositionTemp),
    lv('Viscosity', s9.viscosity),

    sectionHeader(10, 'STABILITY AND REACTIVITY'),
    lv('Reactivity', s10.reactivity),
    lv('Chemical Stability', s10.chemicalStability),
    lv('Possibility of Hazardous Reactions', s10.possibilityOfHazardousReactions),
    lv('Conditions to Avoid', s10.conditionsToAvoid),
    lv('Incompatible Materials', s10.incompatibleMaterials),
    lv('Hazardous Decomposition Products', s10.hazardousDecompositionProducts),

    sectionHeader(11, 'TOXICOLOGICAL INFORMATION'),
    lv('Acute Toxicity', s11.acuteToxicity),
    lv('Skin Corrosion / Irritation', s11.skinCorrosionIrritation),
    lv('Serious Eye Damage / Irritation', s11.seriousEyeDamage),
    lv('Respiratory Sensitization', s11.respiratorySensitization),
    lv('Skin Sensitization', s11.skinSensitization),
    lv('Germ Cell Mutagenicity', s11.germCellMutagenicity),
    lv('Carcinogenicity', s11.carcinogenicity),
    lv('Reproductive Toxicity', s11.reproductiveToxicity),
    lv('Target Organ Toxicity', s11.targetOrganToxicity),
    lv('Aspiration Hazard', s11.aspirationHazard),
    lv('Additional Information', s11.additionalInfo),

    sectionHeader(12, 'ECOLOGICAL INFORMATION'),
    lv('Aquatic Toxicity', s12.aquaticToxicity),
    lv('Persistence and Degradability', s12.persistenceDegradability),
    lv('Bioaccumulative Potential', s12.bioaccumulativePotential),
    lv('Mobility in Soil', s12.mobilityInSoil),
    lv('Other Adverse Effects', s12.otherAdverseEffects),

    sectionHeader(13, 'DISPOSAL CONSIDERATIONS'),
    lv('Waste Disposal Methods', s13.wasteDisposalMethods),
    lv('Contaminated Container Disposal', s13.contamContainerDisposal),

    sectionHeader(14, 'TRANSPORT INFORMATION'),
    lv('UN Number', s14.unNumber),
    lv('Proper Shipping Name', s14.properShippingName),
    lv('Transport Hazard Class', s14.transportHazardClass),
    lv('Packing Group', s14.packingGroup),
    lv('Environmental Hazards', s14.environmentalHazards),
    lv('Special Precautions', s14.specialPrecautions),
    lv('Bulk Transport', s14.bulkTransport),

    sectionHeader(15, 'REGULATORY INFORMATION'),
    lv('Safety / Health / Environmental Regulations', s15.safetyHealthEnvironmentRegulations),
    lv('Chemical Safety Assessment', s15.chemicalSafetyAssessment),

    sectionHeader(16, 'OTHER INFORMATION'),
    lv('Revision Date', s16.revisionDate),
    lv('Prepared By', s16.preparedBy),
    lv('Disclaimer', s16.disclaimer),
    lv('Additional Information', s16.additionalInfo)
  ]

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 }
        }
      },
      children
    }]
  })

  return await Packer.toBuffer(doc)
}
