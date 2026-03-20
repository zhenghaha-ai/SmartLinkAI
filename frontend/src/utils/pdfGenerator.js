import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// A4, margins 20mm, Times New Roman
const mL = 20, mR = 20, mT = 20, mB = 18
const pageW = 210, pageH = 297
const cW = pageW - mL - mR   // 170mm

function newPage(doc) {
  doc.addPage()
  return mT
}

function checkY(doc, y, need) {
  if (y + need > pageH - mB) return newPage(doc)
  return y
}

// Section heading (bold, outside box)
function sectionTitle(doc, text, y) {
  y = checkY(doc, y, 10)
  doc.setFont('times', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(0)
  doc.text(text, mL, y)
  return y + 7
}

// Single-cell bordered box. Each field: bold label inline + normal value on same baseline.
function sectionBox(doc, fields, y) {
  const lh  = 5.5    // line height mm
  const pad = 3      // top/bottom inner padding
  const x   = mL + 3
  const w   = cW - 6

  const boxY = checkY(doc, y, 15)
  let curY   = boxY + pad

  for (const f of fields) {
    const label  = f.label || ''
    const rawVal = Array.isArray(f.value)
      ? f.value.join('\n')
      : (f.value ?? 'N/A')
    const val = String(rawVal || 'N/A')

    if (label) {
      doc.setFont('times', 'bold')
      doc.setFontSize(10)
      const lw = doc.getTextWidth(label)
      const remaining = w - lw

      if (remaining >= 30) {
        // Inline: bold label + normal value on same baseline
        doc.setFont('times', 'normal')
        const lines = doc.splitTextToSize(val, remaining)

        curY = checkY(doc, curY, lh)
        doc.setFont('times', 'bold')
        doc.setTextColor(0)
        doc.text(label, x, curY)

        doc.setFont('times', 'normal')
        doc.text(lines[0] || '', x + lw, curY)
        curY += lh

        for (let i = 1; i < lines.length; i++) {
          curY = checkY(doc, curY, lh)
          doc.text(lines[i], x + lw, curY)
          curY += lh
        }
      } else {
        // Label too long: label line, then value indented below
        curY = checkY(doc, curY, lh)
        doc.setFont('times', 'bold')
        doc.setTextColor(0)
        doc.text(label, x, curY)
        curY += lh

        doc.setFont('times', 'normal')
        const lines = doc.splitTextToSize(val, w)
        for (const line of lines) {
          curY = checkY(doc, curY, lh)
          doc.text(line, x, curY)
          curY += lh
        }
      }
    } else if (val && val !== 'N/A') {
      // No label, just value
      doc.setFont('times', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(0)
      const lines = doc.splitTextToSize(val, w)
      for (const line of lines) {
        curY = checkY(doc, curY, lh)
        doc.text(line, x, curY)
        curY += lh
      }
    }
  }

  curY += pad
  doc.setDrawColor(0)
  doc.setLineWidth(0.3)
  // Draw border (clamp to page bottom if box crosses page break)
  const endY = Math.min(curY, pageH - mB)
  doc.rect(mL, boxY, cW, endY - boxY)

  return curY + 3
}

// Section 3 ingredient table (autoTable)
function ingredientTable(doc, ingredients, y) {
  autoTable(doc, {
    startY: y,
    margin: { left: mL, right: mR },
    head: [['No.', 'Component', 'Percentage by weight', 'CAS #']],
    body: (ingredients || []).map((ing, i) => [
      String(ing.no ?? i + 1),
      ing.component || '',
      ing.percentage || '',
      ing.casNumber || 'N/A',
    ]),
    styles:     { font: 'times', fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.3 },
    headStyles: { fontStyle: 'bold', fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    bodyStyles: { fillColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [255, 255, 255] },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.3,
    columnStyles: { 0: { cellWidth: 12 }, 2: { cellWidth: 35 }, 3: { cellWidth: 28 } },
  })
  return doc.lastAutoTable.finalY + 4
}

export async function generatePDF(sds) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })

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

  let y = mT

  // Cover title
  doc.setFont('times', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(0)
  const titleLines = doc.splitTextToSize(sds.productName || 'Product', cW)
  doc.text(titleLines, pageW / 2, y, { align: 'center' })
  y += titleLines.length * 7 + 2

  doc.setFont('times', 'normal')
  doc.setFontSize(13)
  doc.text('Safety Data Sheet', pageW / 2, y, { align: 'center' })
  y += 6

  doc.setFontSize(10)
  doc.text(`Issue Date: ${sds.issueDate || new Date().toISOString().slice(0, 10)}`, mL, y)
  y += 8

  // Section 1
  y = sectionTitle(doc, '1.  Identification of the substance/mixture and of the company/undertaking', y)
  y = sectionBox(doc, [
    { label: 'Product identifier: ',        value: '' },
    { label: 'Name of the item: ',          value: s1.productIdentifier || sds.productName },
    { label: 'Name of Brand: ',             value: sds.brandName || s1.brandName },
    { label: 'Relevant identified uses: ',  value: s1.recommendedUse },
    { label: 'Name of the company: ',       value: s1.companyName },
    { label: 'Address of the company: ',    value: s1.companyAddress },
    { label: 'Telephone number: ',          value: s1.telephone },
    { label: 'Emergency phone number: ',    value: s1.emergencyPhone },
  ], y)

  // Section 2
  y = sectionTitle(doc, '2.  Hazards Identification', y)
  y = sectionBox(doc, [
    { label: 'Hazard classification according to 29 CFR 1910.1200: ', value: s2.hazardClassification },
    { label: 'Signal word: ',               value: s2.signalWord },
    { label: 'Hazard statements: ',         value: s2.hazardStatements },
    { label: 'Precautionary statements: ',  value: s2.precautionaryStatements },
    { label: 'Response: ',                  value: s2.response },
    { label: 'Storage: ',                   value: s2.storage },
    { label: 'Disposal: ',                  value: s2.disposal },
  ], y)

  // Section 3
  y = sectionTitle(doc, '3.  Composition/information on ingredients', y)
  y = checkY(doc, y, 20)
  y = ingredientTable(doc, s3.ingredients, y)

  // Section 4
  y = sectionTitle(doc, '4.  First aid measures', y)
  y = sectionBox(doc, [
    { label: 'Skin contact: ',  value: s4.skinContact },
    { label: 'Eyes contact: ',  value: s4.eyeContact },
    { label: 'Inhalation: ',    value: s4.inhalation },
    { label: 'Ingestion: ',     value: s4.ingestion },
  ], y)

  // Section 5
  y = sectionTitle(doc, '5.  Firefighting measures', y)
  y = sectionBox(doc, [
    { label: 'Extinguishing agent: ',  value: s5.extinguishingAgent },
    { label: 'Special danger: ',       value: s5.specialDanger },
    { label: 'Protective measures: ',  value: s5.protectiveMeasures },
  ], y)

  // Section 6
  y = sectionTitle(doc, '6.  Accidental release measures', y)
  y = sectionBox(doc, [
    { label: 'Personal precautions, protective equipment and emergency procedures: ', value: s6.personalPrecautions },
    { label: 'Environmental precautions: ',                  value: s6.environmentalPrecautions },
    { label: 'Methods and materials for containment and cleaning up: ', value: s6.containmentMethods },
  ], y)

  // Section 7
  y = sectionTitle(doc, '7.  Handling and storage', y)
  y = sectionBox(doc, [
    { label: 'Precautions for safe handling: ',                              value: s7.safeHandling },
    { label: 'Conditions for safe storage, including any incompatibilities: ', value: s7.storageConditions },
  ], y)

  // Section 8
  y = sectionTitle(doc, '8.  Exposure controls/personal protection', y)
  y = sectionBox(doc, [
    { label: 'Occupational Exposure limit values: ', value: s8.occupationalExposureLimit },
    { label: 'Biological limit values: ',            value: s8.biologicalLimitValues },
    { label: 'Appropriate engineering controls: ',   value: s8.engineeringControls },
    { label: 'Eye/face protection: ',                value: s8.eyeFaceProtection },
    { label: 'Skin protection: ',                    value: s8.skinProtection },
    { label: 'Respiratory protection: ',             value: s8.respiratoryProtection },
    { label: 'Thermal hazards: ',                    value: s8.thermalHazards },
  ], y)

  // Section 9
  y = sectionTitle(doc, '9.  Physical and chemical properties', y)
  y = sectionBox(doc, [
    { label: 'Appearance: ',           value: s9.appearance },
    { label: 'Colour: ',               value: `${s9.colour || 'N/A'}  Odour: ${s9.odour || 'N/A'}` },
    { label: 'PH: ',                   value: `${s9.pH || 'N/A'}  Boiling point/range: ${s9.boilingPoint || 'N/A'}` },
    { label: 'Melting point/range: ',  value: `${s9.meltingPoint || 'N/A'}  Flashpoint: ${s9.flashPoint || 'N/A'}` },
    { label: 'Density: ',              value: `${s9.density || 'N/A'}  Viscosity: ${s9.viscosity || 'N/A'}` },
    { label: 'Oxidising properties: ', value: `${s9.oxidising || 'N/A'}  Vapour pressure: ${s9.vapourPressure || 'N/A'}` },
    { label: 'Solubility in water: ',  value: `${s9.solubility || 'N/A'}  Vapour density: ${s9.vapourDensity || 'N/A'}` },
    { label: 'UEL: ',                  value: `${s9.UEL || 'N/A'}  Evaporation rate: ${s9.evaporationRate || 'N/A'}` },
  ], y)

  // Section 10
  y = sectionTitle(doc, '10.  Stability and reactivity', y)
  y = sectionBox(doc, [
    { label: 'Stability: ',                          value: s10.stability },
    { label: 'Conditions to avoid: ',               value: s10.conditionsToAvoid },
    { label: 'Incompatible materials: ',             value: s10.incompatibleMaterials },
    { label: 'Hazardous Polymerization: ',           value: s10.hazardousPolymerization },
    { label: 'Decomposition products: ',             value: s10.decompositionProducts },
    { label: 'Possibility of hazardous reactions: ', value: s10.possibilityOfHazardousReactions },
  ], y)

  // Section 11
  y = sectionTitle(doc, '11.  Toxicological information', y)
  y = sectionBox(doc, [
    { label: 'Acute Toxicity: ',                value: s11.acuteToxicity },
    { label: 'Sub-acute and Chronic Toxicity: ', value: s11.chronicToxicity },
    { label: 'Irritation: ',                    value: s11.irritation },
    { label: 'Sensitization: ',                 value: s11.sensitization },
    { label: 'Mutagenicity: ',                  value: s11.mutagenicity },
    { label: 'Carcinogenicity: ',               value: s11.carcinogenicity },
  ], y)

  // Section 12
  y = sectionTitle(doc, '12.  Ecological information', y)
  y = sectionBox(doc, [
    { label: 'Ecological toxicity: ',        value: s12.ecologicalToxicity },
    { label: 'Persistence and degradation: ', value: s12.persistenceDegradation },
    { label: 'Potential bioaccumulation: ',   value: s12.bioaccumulation },
    { label: 'Migration in soil: ',           value: s12.soilMigration },
    { label: 'Other harmful effects: ',       value: s12.otherHarmfulEffects },
  ], y)

  // Section 13
  y = sectionTitle(doc, '13.  Disposal considerations', y)
  y = sectionBox(doc, [
    { label: 'Disposal method: ',        value: s13.disposalMethod },
    { label: 'Disposal considerations: ', value: s13.disposalConsiderations },
  ], y)

  // Section 14
  y = sectionTitle(doc, '14.  Transport information', y)
  y = sectionBox(doc, [
    { label: '',                              value: s14.iataInfo },
    { label: 'UN number: ',                   value: s14.unNumber },
    { label: 'Risk classification: ',         value: s14.riskClassification },
    { label: 'Land Transport ADR/RID: ',      value: s14.landTransport },
    { label: 'Maritime Transport IMO/IMDG: ', value: s14.maritimeTransport },
    { label: 'Air Transport IATA/ICAO: ',     value: s14.airTransport },
    { label: 'Packaging Information: ',       value: s14.packagingInfo },
    { label: 'Transport Fashion: ',           value: s14.transportFashion },
    { label: 'Transport Attentions: ',        value: s14.transportAttentions },
  ], y)

  // Section 15
  y = sectionTitle(doc, '15.  Regulatory information', y)
  y = sectionBox(doc, [
    { label: 'Regulatory Information: ', value: s15.regulatoryInfo },
  ], y)

  // Section 16
  y = sectionTitle(doc, '16.  Other information', y)
  sectionBox(doc, [
    { label: 'References: ',  value: s16.references },
    { label: 'Disclaimer: ',  value: s16.disclaimer },
  ], y)

  // Page numbers
  const total = doc.internal.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setFont('times', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100)
    doc.text(`Page ${i} of ${total}`, pageW - mR, pageH - 8, { align: 'right' })
  }

  const name = `${(sds.productName || 'SDS').replace(/[^\w\s-]/g, '').trim()}-SDS.pdf`
  doc.save(name)
}
