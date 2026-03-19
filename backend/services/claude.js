import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

export async function generateSdsContent(formData) {
  const { productName, brandName, productUse, companyName, companyAddress, companyPhone, emergencyPhone, ingredients } = formData

  const ingredientList = (ingredients || [])
    .map(i => `- ${i.name} (CAS: ${i.cas || 'N/A'}, 占比: ${i.percentage || 'N/A'}%)`)
    .join('\n')

  const prompt = `你是一位专业的化学品安全专家，精通 GHS/OSHA 29 CFR 1910.1200 标准。
请根据以下产品信息，生成完整的安全数据表（SDS）内容，以严格的 JSON 格式返回。

产品信息：
- 产品名称：${productName}
- 品牌名：${brandName || '未提供'}
- 用途：${productUse || '未提供'}
- 公司名称：${companyName || '未提供'}
- 公司地址：${companyAddress || '未提供'}
- 公司电话：${companyPhone || '未提供'}
- 紧急电话：${emergencyPhone || 'CHEMTREC: 1-800-424-9300'}

成分表：
${ingredientList || '未提供成分信息'}

请返回如下 JSON 结构��所有内容用英文填写，符合美国 OSHA SDS 标准）：

{
  "section1": {
    "productName": "",
    "otherNames": "",
    "recommendedUse": "",
    "restrictedUse": "",
    "supplierName": "",
    "supplierAddress": "",
    "supplierPhone": "",
    "emergencyPhone": ""
  },
  "section2": {
    "classification": "",
    "signalWord": "",
    "hazardStatements": [],
    "precautionaryStatements": {
      "prevention": [],
      "response": [],
      "storage": [],
      "disposal": []
    },
    "hazardPictograms": [],
    "otherHazards": ""
  },
  "section3": {
    "substanceOrMixture": "Mixture",
    "ingredients": []
  },
  "section4": {
    "eyeContact": "",
    "skinContact": "",
    "inhalation": "",
    "ingestion": "",
    "importantSymptomsEffects": "",
    "immediatemedicalAttention": ""
  },
  "section5": {
    "suitableExtinguishingMedia": "",
    "unsuitableExtinguishingMedia": "",
    "specificHazards": "",
    "specialProtectiveEquipment": ""
  },
  "section6": {
    "personalPrecautions": "",
    "environmentalPrecautions": "",
    "containmentCleanup": "",
    "referenceToOtherSections": ""
  },
  "section7": {
    "precautionsForSafeHandling": "",
    "conditionsForSafeStorage": "",
    "specificEndUses": ""
  },
  "section8": {
    "controlParameters": "",
    "engineeringControls": "",
    "personalProtectiveEquipment": {
      "eyeFace": "",
      "skin": "",
      "respiratory": "",
      "general": ""
    }
  },
  "section9": {
    "appearance": "",
    "odor": "",
    "odorThreshold": "",
    "pH": "",
    "meltingPoint": "",
    "boilingPoint": "",
    "flashPoint": "",
    "evaporationRate": "",
    "flammability": "",
    "vaporPressure": "",
    "vaporDensity": "",
    "relativeDensity": "",
    "solubility": "",
    "partitionCoefficient": "",
    "autoIgnitionTemp": "",
    "decompositionTemp": "",
    "viscosity": ""
  },
  "section10": {
    "reactivity": "",
    "chemicalStability": "",
    "possibilityOfHazardousReactions": "",
    "conditionsToAvoid": "",
    "incompatibleMaterials": "",
    "hazardousDecompositionProducts": ""
  },
  "section11": {
    "acuteToxicity": "",
    "skinCorrosionIrritation": "",
    "seriousEyeDamage": "",
    "respiratorySensitization": "",
    "skinSensitization": "",
    "germCellMutagenicity": "",
    "carcinogenicity": "",
    "reproductiveToxicity": "",
    "targetOrganToxicity": "",
    "aspirationHazard": "",
    "additionalInfo": ""
  },
  "section12": {
    "aquaticToxicity": "",
    "persistenceDegradability": "",
    "bioaccumulativePotential": "",
    "mobilityInSoil": "",
    "otherAdverseEffects": ""
  },
  "section13": {
    "wasteDisposalMethods": "",
    "contamContainerDisposal": ""
  },
  "section14": {
    "unNumber": "",
    "properShippingName": "",
    "transportHazardClass": "",
    "packingGroup": "",
    "environmentalHazards": "",
    "specialPrecautions": "",
    "bulkTransport": ""
  },
  "section15": {
    "safetyHealthEnvironmentRegulations": "",
    "chemicalSafetyAssessment": ""
  },
  "section16": {
    "revisionDate": "${new Date().toLocaleDateString('en-US')}",
    "preparedBy": "",
    "disclaimer": "The information provided in this Safety Data Sheet is correct to the best of our knowledge, information and belief at the date of its publication. The information given is designed only as a guide for safe handling, use, processing, storage, transportation, disposal and release and is not to be considered a warranty or quality specification.",
    "additionalInfo": ""
  }
}

只返回 JSON，不要任何额外说明文字。`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  })

  const text = message.content[0].text.trim()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('AI 返回格式错误')

  return JSON.parse(jsonMatch[0])
}
