const BASE_URL = import.meta.env.VITE_GEMINI_BASE_URL || 'http://localhost:3001/v1'
const MODEL    = import.meta.env.VITE_GEMINI_MODEL    || 'gemini-2.0-flash'
const API_KEY  = import.meta.env.VITE_GEMINI_API_KEY  || ''

const SYSTEM_PROMPT = `You are an expert chemist and safety professional specializing in Safety Data Sheets (SDS) compliant with OSHA 29 CFR 1910.1200 and GHS.

Given product information, generate a complete professional SDS. Base all hazard assessments on the actual chemical ingredients (CAS numbers and percentages).

CRITICAL RULES:
1. NEVER return empty strings for any field. Every field must have a value.
2. For fields where the user provided data, use that data EXACTLY as provided.
3. For optional fields where no user data is provided, use the standard default text below — do NOT generate custom content:
   - Module 9 (Physical & Chemical Properties): use "N/A"
   - Module 11 (Toxicological Information): use "No relevant data."
   - Module 12 (Ecological Information): use "No relevant data."
   - Module 16 references: use "GHS; OSHA 29 CFR 1910.1200"
   - Module 16 disclaimer: use "The information in this SDS was obtained from sources believed to be reliable. It is provided in good faith and believed to be accurate. However, no representation, warranty or guarantee is made as to its completeness or accuracy. This information is supplied upon the condition that the persons receiving it will make their own determination of the suitability for their purposes prior to use."
   - All other fields with no user data: use "No relevant data."

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "productName": "string",
  "brandName": "string",
  "issueDate": "YYYY-MM-DD",
  "section1": {
    "productIdentifier": "string",
    "recommendedUse": "string",
    "restrictions": "string",
    "companyName": "string",
    "companyAddress": "string",
    "telephone": "string",
    "emergencyPhone": "string"
  },
  "section2": {
    "hazardClassification": "string",
    "hazardSymbol": "string",
    "signalWord": "Warning or Danger",
    "hazardStatements": ["H-code: description"],
    "precautionaryStatements": ["P-code: description"],
    "response": "string",
    "storage": "string",
    "disposal": "string"
  },
  "section3": {
    "ingredients": [
      { "no": 1, "component": "string", "casNumber": "string", "percentage": "string" }
    ]
  },
  "section4": { "skinContact": "string", "eyeContact": "string", "inhalation": "string", "ingestion": "string" },
  "section5": { "extinguishingAgent": "string", "specialDanger": "string", "protectiveMeasures": "string" },
  "section6": { "personalPrecautions": "string", "environmentalPrecautions": "string", "containmentMethods": "string" },
  "section7": { "safeHandling": "string", "storageConditions": "string", "storageIncompatibles": "string" },
  "section8": {
    "occupationalExposureLimit": "string", "biologicalLimitValues": "string",
    "engineeringControls": "string", "eyeFaceProtection": "string",
    "skinProtection": "string", "respiratoryProtection": "string", "thermalHazards": "string"
  },
  "section9": {
    "appearance": "string", "colour": "string", "odour": "string", "pH": "string",
    "boilingPoint": "string", "meltingPoint": "string", "flashPoint": "string",
    "density": "string", "viscosity": "string", "oxidising": "string",
    "vapourPressure": "string", "solubility": "string", "vapourDensity": "string",
    "partitionCoefficient": "string", "ignitionTemperature": "string",
    "evaporationRate": "string", "UEL": "string"
  },
  "section10": { "stability": "string", "conditionsToAvoid": "string", "incompatibleMaterials": "string", "hazardousPolymerization": "string", "decompositionProducts": "string", "possibilityOfHazardousReactions": "string" },
  "section11": { "acuteToxicity": "string", "chronicToxicity": "string", "irritation": "string", "sensitization": "string", "mutagenicity": "string", "carcinogenicity": "string" },
  "section12": { "ecologicalToxicity": "string", "persistenceDegradation": "string", "bioaccumulation": "string", "soilMigration": "string", "otherHarmfulEffects": "string" },
  "section13": { "disposalMethod": "string", "disposalConsiderations": "string" },
  "section14": { "iataInfo": "string", "unNumber": "string", "riskClassification": "string", "landTransport": "string", "maritimeTransport": "string", "airTransport": "string", "packagingInfo": "string", "transportFashion": "string", "transportAttentions": "string" },
  "section15": { "regulatoryInfo": "string" },
  "section16": { "references": "string", "disclaimer": "string" }
}`

export async function generateSDS(productData) {
  const userPrompt = `Generate a complete SDS for:

Product Name: ${productData.productName}
Brand: ${productData.brandName || 'N/A'}
Issue Date: ${productData.issueDate || ''}
Intended Use: ${productData.intendedUse || 'Consumer product'}

Company:
- Name: ${productData.companyName || 'N/A'}
- Address: ${productData.companyAddress || 'N/A'}
- Phone: ${productData.telephone || 'N/A'}
- Emergency Phone: ${productData.emergencyPhone || productData.telephone || 'N/A'}

Ingredients:
${productData.ingredients.map((ing, i) =>
  `${i + 1}. ${ing.component} | CAS: ${ing.casNumber || 'N/A'} | ${ing.percentage}%`
).join('\n')}

Pre-filled section data (use EXACTLY if provided, otherwise generate from chemical knowledge):

Section 2 - Hazard Identification:
- Hazard Classification: ${productData.hazardClassification || ''}
- Hazard Symbol: ${productData.hazardSymbol || ''}
- Signal Word: ${productData.signalWord || ''}
- Hazard Statements: ${productData.hazardStatements || ''}
- Precautionary Statements: ${productData.precautionaryStatements || ''}
- Response: ${productData.hazardResponse || ''}
- Storage: ${productData.hazardStorage || ''}
- Disposal: ${productData.hazardDisposal || ''}

Section 4 - First Aid:
- Skin Contact: ${productData.firstAidSkin || ''}
- Eyes Contact: ${productData.firstAidEyes || ''}
- Inhalation: ${productData.firstAidInhalation || ''}
- Ingestion: ${productData.firstAidIngestion || ''}

Section 5 - Firefighting:
- Extinguishing Agent: ${productData.firefightingAgent || ''}
- Special Danger: ${productData.firefightingDanger || ''}
- Protective Measures: ${productData.firefightingProtection || ''}

Section 6 - Accidental Release:
- Personal Precautions: ${productData.releasePersonal || ''}
- Environmental Precautions: ${productData.releaseEnvironmental || ''}
- Cleanup Methods: ${productData.releaseCleanup || ''}

Section 7 - Handling & Storage:
- Safe Handling Precautions: ${productData.handlingPrecautions || ''}
- Safe Storage Conditions: ${productData.storageConditions || ''}
- Incompatible materials for storage: ${productData.storageIncompatibles || ''}

Section 8 - Exposure Controls/PPE:
- Occupational Exposure Limit: ${productData.exposureOEL || ''}
- Biological Limit Values: ${productData.exposureBiological || ''}
- Engineering Controls: ${productData.exposureEngineering || ''}
- Eye/Face Protection: ${productData.ppeFace || ''}
- Skin Protection: ${productData.ppeSkin || ''}
- Respiratory Protection: ${productData.ppeRespiratory || ''}
- Thermal Hazards: ${productData.ppeThermal || ''}

Physical & Chemical Properties (use provided values; infer from ingredients if blank):
- Appearance: ${productData.appearance || ''}
- Colour: ${productData.colour || ''}
- Odour: ${productData.odour || ''}
- pH: ${productData.pH || ''}
- Boiling point/range: ${productData.boilingPoint || ''}
- Melting point/range: ${productData.meltingPoint || ''}
- Flash point: ${productData.flashPoint || ''}
- Density: ${productData.density || ''}
- Viscosity: ${productData.viscosity || ''}
- Oxidising properties: ${productData.oxidising || ''}
- Vapour pressure: ${productData.vapourPressure || ''}
- Solubility in water: ${productData.solubility || ''}
- Vapour density: ${productData.vapourDensity || ''}
- Partition coefficient (n-octanol/water): ${productData.partitionCoefficient || ''}
- Ignition temperature: ${productData.ignitionTemperature || ''}
- Evaporation rate: ${productData.evaporationRate || ''}
- UEL (Upper Explosive Limit): ${productData.UEL || ''}

Section 10 - Stability & Reactivity:
- Stability: ${productData.stability || ''}
- Materials to Avoid (禁配物): ${productData.materialsToAvoid || ''}
- Conditions to Avoid: ${productData.conditionsToAvoid || ''}
- Incompatible materials: ${productData.incompatibleMaterials || ''}
- Hazardous Polymerization: ${productData.hazardousPolymerization || ''}
- Decomposition products: ${productData.decompositionProducts || ''}
- Possibility of hazardous reactions: ${productData.possibilityOfHazardousReactions || ''}

Section 11 - Toxicology:
- Acute Toxicity: ${productData.acuteToxicity || ''}
- Chronic Toxicity: ${productData.chronicToxicity || ''}
- Irritation: ${productData.irritation || ''}
- Sensitization: ${productData.sensitization || ''}
- Mutagenicity: ${productData.mutagenicity || ''}
- Carcinogenicity: ${productData.carcinogenicity || ''}

Section 12 - Ecology:
- Ecological toxicity: ${productData.ecologicalToxicity || ''}
- Persistence and degradation: ${productData.persistenceDegradation || ''}
- Bioaccumulation: ${productData.bioaccumulation || ''}
- Soil migration: ${productData.soilMigration || ''}
- Other harmful effects: ${productData.otherHarmfulEffects || ''}

Section 13 - Disposal:
- Disposal method: ${productData.disposalMethod || ''}
- Disposal considerations: ${productData.disposalConsiderations || ''}

Section 14 - Transport:
- Transport standard: ${productData.iataInfo || ''}
- UN Number: ${productData.unNumber || ''}
- Risk classification: ${productData.riskClassification || ''}
- Land Transport ADR/RID: ${productData.landTransport || ''}
- Maritime Transport IMO/IMDG: ${productData.maritimeTransport || ''}
- Air Transport IATA/ICAO: ${productData.airTransport || ''}
- Packaging Information: ${productData.packagingInfo || ''}
- Transport Fashion: ${productData.transportFashion || ''}
- Transport Attentions: ${productData.transportAttentions || ''}

Section 15 - Regulatory:
- Regulatory Information: ${productData.regulatoryInfo || ''}

Section 16 - Other:
- References: ${productData.references || ''}
- Disclaimer: ${productData.disclaimer || ''}`

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'Authorization': `Bearer ${API_KEY}` } : {}),
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API 请求失败 (${res.status})`)
  }

  const data = await res.json()
  const content = data.choices[0].message.content
  return JSON.parse(content)
}

export function parseExcelRow(row, idx) {
  const get = (...keys) => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== '') return String(row[k])
    }
    return ''
  }

  const ingredients = []
  for (let i = 1; i <= 10; i++) {
    const comp = get(`成分${i}`, `Ingredient${i}`, `Component${i}`)
    if (!comp) break
    ingredients.push({
      component: comp,
      casNumber: get(`CAS${i}`, `CAS号${i}`, `CAS#${i}`),
      percentage: get(`占比${i}`, `Percentage${i}`, `百分比${i}`) || '100',
    })
  }

  if (!ingredients.length) {
    const comp = get('成分', 'Ingredient', 'Component', '主要成分')
    ingredients.push({
      component: comp || 'Not specified',
      casNumber: get('CAS', 'CAS号'),
      percentage: get('占比', 'Percentage', '百分比') || '100',
    })
  }

  return {
    productName: get('产品名称', 'ProductName', 'Product Name', 'Name') || `Product ${idx + 1}`,
    brandName: get('品牌', 'Brand', 'BrandName'),
    intendedUse: get('用途', 'Use', 'IntendedUse'),
    productType: get('产品类型', 'ProductType', 'Product Type', 'Type'),
    companyName: get('公司名称', 'Company', 'CompanyName'),
    companyAddress: get('公司地址', 'Address', 'CompanyAddress'),
    telephone: get('电话', 'Tel', 'Telephone', 'Phone'),
    emergencyPhone: get('紧急电话', 'EmergencyPhone'),
    appearance: get('外观', 'Appearance'),
    colour: get('颜色', 'Color', 'Colour'),
    odour: get('气味', 'Odour', 'Odor'),
    ingredients,
  }
}
