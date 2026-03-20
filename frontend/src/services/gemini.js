const BASE_URL = import.meta.env.VITE_GEMINI_BASE_URL || 'http://localhost:3001/v1'
const MODEL    = import.meta.env.VITE_GEMINI_MODEL    || 'gemini-2.0-flash'

const SYSTEM_PROMPT = `You are an expert chemist and safety professional specializing in Safety Data Sheets (SDS) compliant with OSHA 29 CFR 1910.1200 and GHS.

Given product information, generate a complete professional SDS. Base all hazard assessments on the actual chemical ingredients (CAS numbers and percentages).

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
  "section7": { "safeHandling": "string", "storageConditions": "string" },
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
  "section10": { "stability": "string", "incompatibleMaterials": "string", "hazardousPolymerization": "string", "possibilityOfHazardousReactions": "string" },
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
Intended Use: ${productData.intendedUse || 'Consumer product'}
Product Type: ${productData.productType || 'General consumer product'}

Company:
- Name: ${productData.companyName || 'N/A'}
- Address: ${productData.companyAddress || 'N/A'}
- Phone: ${productData.telephone || 'N/A'}
- Emergency Phone: ${productData.emergencyPhone || productData.telephone || 'N/A'}

Ingredients:
${productData.ingredients.map((ing, i) =>
  `${i + 1}. ${ing.component} | CAS: ${ing.casNumber || 'N/A'} | ${ing.percentage}%`
).join('\n')}

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
- UEL (Upper Explosive Limit): ${productData.UEL || ''}`

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
