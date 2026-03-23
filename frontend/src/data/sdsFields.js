// SDS 字段定义 - 严格对齐 键值对里面的键.md
export const SDS_FIELDS = {

  // Module 1: Identification - 必填
  module1: [
    { key: 'productName',    label: 'Full product name（产品全称）',                          required: true,  placeholder: 'e.g. Golf Ball Line Marker Alignment Tool Kit' },
    { key: 'brandName',      label: 'Product brand name（产品品牌名称）',                      required: true,  placeholder: 'e.g. Weysat' },
    { key: 'intendedUse',    label: 'Recommended use of the product（产品推荐使用用途）',       required: true,  placeholder: 'e.g. Painting. Sports equipment.' },
    { key: 'issueDate',      label: 'Issue Date（SDS 发布日期）',                              required: false, placeholder: 'e.g. 2025-01-01' },
    { key: 'companyName',    label: 'Supplier company name（供应商公司名称）',                  required: true,  placeholder: 'e.g. Your Company Ltd.' },
    { key: 'companyAddress', label: 'Detailed address of the supplier（供应商公司详细地址）',   required: true,  placeholder: 'e.g. Room 606, No.27, Guangjin Road, Dongguan' },
    { key: 'telephone',      label: 'Supplier telephone number（供应商联系电话）',              required: true,  placeholder: 'e.g. 19966180956' },
    { key: 'emergencyPhone', label: 'Supplier emergency phone number（供应商紧急联系电话）',    required: true,  placeholder: 'e.g. 19966180956' },
  ],

  // Module 2: Hazards Identification - 必填
  module2: [
    { key: 'hazardClassification',  label: 'Hazard classification according to 29 CFR 1910.1200（危险分类）',  required: true,  placeholder: 'e.g. Flammable liquid and vapor Category 3' },
    { key: 'hazardSymbol',          label: 'Hazard symbol / password（危险标识图案 / 代号）',                   required: true,  placeholder: 'e.g. GHS02; GHS07' },
    { key: 'signalWord',            label: 'Signal word（警示词）',                                            required: true,  placeholder: 'e.g. Warning / Danger' },
    { key: 'hazardStatements',      label: 'Hazard statements including H code（危险说明含 H 编码）',           required: true,  placeholder: 'e.g. H319 Causes serious eye irritation.' },
    { key: 'precautionaryStatements', label: 'Precautionary statements including P code（预防说明含 P 编码，可多填）', required: true, placeholder: 'e.g. P312 Call a POISON CENTER if you feel unwell.\nP305+P351+P338 IF IN EYES: Rinse cautiously...' },
    { key: 'hazardResponse',        label: 'Response requirements（应急响应要求）',                             required: true,  placeholder: 'e.g. No applicable.' },
    { key: 'hazardStorage',         label: 'Core product storage requirements（产品贮存核心要求）',              required: true,  placeholder: 'e.g. Store locked up.' },
    { key: 'hazardDisposal',        label: 'Core product disposal requirements（产品废弃处置核心要求）',         required: true,  placeholder: 'e.g. Dispose of contents/container in accordance with local regulations.' },
  ],

  // Module 4: First Aid - 必填
  module4: [
    { key: 'firstAidSkin',       label: 'Emergency treatment for skin contact（皮肤接触后的应急处理）',  required: true, placeholder: 'e.g. Remove contaminated clothes and rinse with plenty of water and soap.' },
    { key: 'firstAidEyes',       label: 'Emergency treatment for eye contact（眼睛接触后的应急处理）',  required: true, placeholder: 'e.g. Flush with plenty of water or saline for 15 minutes.' },
    { key: 'firstAidInhalation', label: 'Emergency treatment for inhalation（吸入后的应急处理）',      required: true, placeholder: 'e.g. Move to fresh air. Seek medical attention if needed.' },
    { key: 'firstAidIngestion',  label: 'Emergency treatment for ingestion（食入后的应急处理）',       required: true, placeholder: 'e.g. Do not induce vomiting. Seek medical attention immediately.' },
  ],

  // Module 5: Firefighting - 必填
  module5: [
    { key: 'firefightingAgent',      label: 'Recommended extinguishing agent（推荐灭火介质）',                    required: true, placeholder: 'e.g. Use water mist, dry powder, foam or CO2.' },
    { key: 'firefightingDanger',     label: 'Special fire hazards of the product（消防特殊危险）',                required: true, placeholder: 'e.g. No relevant data.' },
    { key: 'firefightingProtection', label: 'Core protective measures for firefighters（消防人员防护核心措施）',   required: true, placeholder: 'e.g. Wear self-contained breathing apparatus and full protective clothing.' },
  ],

  // Module 6: Accidental Release - 必填
  module6: [
    { key: 'releasePersonal',      label: 'Personal precautions and emergency procedures after leakage（泄漏后人员防护及应急程序）', required: true, placeholder: 'e.g. Evacuate personnel. Wear protective equipment. Avoid breathing vapours.' },
    { key: 'releaseEnvironmental', label: 'Environmental protection measures after leakage（泄漏后环境保护措施）',                  required: true, placeholder: 'e.g. Do not let chemical enter drains. Prevent discharge into environment.' },
    { key: 'releaseCleanup',       label: 'Containment and cleaning methods after leakage（泄漏后围堵及清理方法）',                 required: true, placeholder: 'e.g. Collect and arrange disposal in accordance with local regulations.' },
  ],

  // Module 7: Handling and Storage - 必填
  module7: [
    { key: 'handlingPrecautions',  label: 'Precautions for safe handling（产品安全操作注意事项）',                       required: true, placeholder: 'e.g. Handle in well-ventilated place. Avoid contact with skin and eyes.' },
    { key: 'storageConditions',    label: 'Conditions for safe storage（产品安全贮存条件）',                            required: true, placeholder: 'e.g. Stored in cool and dry condition. Keep container tightly closed.' },
    { key: 'storageIncompatibles', label: 'Incompatible materials for storage（产品贮存的不相容物质）',                  required: true, placeholder: 'e.g. No relevant data. / Strong oxidizing agents.' },
  ],

  // Module 8: Exposure Controls / PPE - 必填
  module8: [
    { key: 'exposureOEL',         label: 'Occupational Exposure limit values（职业接触限值）',          required: true, placeholder: 'e.g. No relevant data.' },
    { key: 'exposureBiological',  label: 'Biological limit values（生物接触限值）',                     required: true, placeholder: 'e.g. No relevant data.' },
    { key: 'exposureEngineering', label: 'Core engineering control measures（工程控制核心措施）',        required: true, placeholder: 'e.g. Ensure adequate ventilation. Set up emergency exits.' },
    { key: 'ppeFace',             label: 'Eye / face protection requirements（眼睛 / 面部防护要求）',   required: true, placeholder: 'e.g. Wear safety spectacles.' },
    { key: 'ppeSkin',             label: 'Skin protection requirements（皮肤防护要求）',                required: true, placeholder: 'e.g. Overalls. Protective gloves.' },
    { key: 'ppeRespiratory',      label: 'Respiratory protection requirements（呼吸防护要求）',         required: true, placeholder: 'e.g. Use local exhaust or breathing protection.' },
    { key: 'ppeThermal',          label: 'Thermal hazards description（热危害相关说明）',               required: true, placeholder: 'e.g. No relevant data.' },
  ],

  // Module 9: Physical and Chemical Properties - 选填
  module9: [
    { key: 'appearance',           label: 'Product appearance（产品外观）',                          fullWidth: true,  required: false, placeholder: 'e.g. Solid / Liquid / Paste' },
    { key: 'colour',               label: 'Product colour（产品颜色）',                              fullWidth: false, required: false, placeholder: 'e.g. Colorful / White / N/A' },
    { key: 'odour',                label: 'Product odour（产品气味）',                               fullWidth: false, required: false, placeholder: 'e.g. Odourless / Mild / N/A' },
    { key: 'pH',                   label: 'pH value（pH 值）',                                       fullWidth: false, required: false, placeholder: 'e.g. 7.0 / N/A' },
    { key: 'boilingPoint',         label: 'Boiling point / range（沸点 / 沸程）',                    fullWidth: false, required: false, placeholder: 'e.g. >100°C / N/A' },
    { key: 'meltingPoint',         label: 'Melting point / range（熔点 / 熔程）',                    fullWidth: false, required: false, placeholder: 'e.g. N/A' },
    { key: 'flashPoint',           label: 'Flashpoint（闪点）',                                      fullWidth: false, required: false, placeholder: 'e.g. >93°C / N/A' },
    { key: 'density',              label: 'Density（密度）',                                         fullWidth: false, required: false, placeholder: 'e.g. 1.05 g/cm³ / N/A' },
    { key: 'viscosity',            label: 'Viscosity（黏度）',                                       fullWidth: false, required: false, placeholder: 'e.g. N/A' },
    { key: 'oxidising',            label: 'Oxidising properties（氧化性）',                          fullWidth: false, required: false, placeholder: 'e.g. No / N/A' },
    { key: 'vapourPressure',       label: 'Vapour pressure（蒸气压）',                               fullWidth: false, required: false, placeholder: 'e.g. <0.1 hPa / N/A' },
    { key: 'solubility',           label: 'Solubility in water（水溶性）',                           fullWidth: false, required: false, placeholder: 'e.g. Slightly soluble / N/A' },
    { key: 'vapourDensity',        label: 'Vapour density（蒸气密度）',                              fullWidth: false, required: false, placeholder: 'e.g. N/A' },
    { key: 'partitionCoefficient', label: 'Partition coefficient n-octanol/water（辛醇/水分配系数）', fullWidth: false, required: false, placeholder: 'e.g. N/A' },
    { key: 'ignitionTemperature',  label: 'Ignition temperature（引燃温度）',                        fullWidth: false, required: false, placeholder: 'e.g. N/A' },
    { key: 'evaporationRate',      label: 'Evaporation rate（蒸发速率）',                            fullWidth: false, required: false, placeholder: 'e.g. N/A' },
    { key: 'UEL',                  label: 'Upper Explosive Limit UEL（爆炸上限）',                   fullWidth: false, required: false, placeholder: 'e.g. N/A' },
  ],

  // Module 10: Stability and Reactivity - 必填
  module10: [
    { key: 'stability',                      label: 'Product stability description（产品稳定性说明）',                        required: true, placeholder: 'e.g. Stable under normal temperature and pressure.' },
    { key: 'materialsToAvoid',               label: 'Incompatible materials for storage/use（禁配物）',                      required: true, placeholder: 'e.g. Strong oxidizing agent, strong acid.' },
    { key: 'conditionsToAvoid',              label: 'Conditions to avoid for the product（需避免接触的条件）',               required: true, placeholder: 'e.g. Flame, heat, open flames, incompatible materials.' },
    { key: 'incompatibleMaterials',          label: 'Incompatible materials（不相容物质）',                                  required: true, placeholder: 'e.g. No relevant data.' },
    { key: 'hazardousPolymerization',        label: 'Possibility of hazardous polymerization（危险聚合反应可能性）',         required: true, placeholder: 'e.g. No relevant data.' },
    { key: 'decompositionProducts',          label: 'Decomposition products description（分解产物说明）',                    required: true, placeholder: 'e.g. No relevant data.' },
    { key: 'possibilityOfHazardousReactions',label: 'Possibility of hazardous reactions under normal conditions（正常条件下危险反应可能性）', required: true, placeholder: 'e.g. No hazardous reactions known under normal conditions.' },
  ],

  // Module 11: Toxicological Information - 选填
  module11: [
    { key: 'acuteToxicity',   label: 'Acute Toxicity description（急性毒性说明）',              required: false, placeholder: 'e.g. No known significant effects or serious harm.' },
    { key: 'chronicToxicity', label: 'Sub-acute and Chronic Toxicity description（亚急性和慢性毒性说明）', required: false, placeholder: 'e.g. No known significant effects or serious harm.' },
    { key: 'irritation',      label: 'Irritation description（刺激性说明）',                   required: false, placeholder: 'e.g. No known significant effects or serious harm.' },
    { key: 'sensitization',   label: 'Sensitization description（致敏性说明）',                required: false, placeholder: 'e.g. No known significant effects or serious harm.' },
    { key: 'mutagenicity',    label: 'Mutagenicity description（致突变性说明）',               required: false, placeholder: 'e.g. No known significant effects or serious harm.' },
    { key: 'carcinogenicity', label: 'Carcinogenicity description（致癌性说明）',              required: false, placeholder: 'e.g. No known significant effects or serious harm.' },
  ],

  // Module 12: Ecological Information - 选填
  module12: [
    { key: 'ecologicalToxicity',     label: 'Ecotoxicity description（生态毒性说明）',                  required: false, placeholder: 'e.g. None.' },
    { key: 'persistenceDegradation', label: 'Persistence and degradation description（持久性和降解性说明）', required: false, placeholder: 'e.g. No information.' },
    { key: 'bioaccumulation',        label: 'Potential bioaccumulation description（生物累积性说明）',    required: false, placeholder: 'e.g. No information.' },
    { key: 'soilMigration',          label: 'Migration in soil description（土壤迁移性说明）',           required: false, placeholder: 'e.g. No information.' },
    { key: 'otherHarmfulEffects',    label: 'Other harmful effects description（其他有害作用说明）',      required: false, placeholder: 'e.g. None.' },
  ],

  // Module 13: Disposal Considerations - 必填
  module13: [
    { key: 'disposalMethod',         label: 'Core disposal method for product waste（产品废弃物核心处置方法）',  required: true, placeholder: 'e.g. Recycle or dispose in compliance with current legislation.' },
    { key: 'disposalConsiderations', label: 'Precautions for product waste disposal（废弃物处置注意事项）',      required: true, placeholder: 'e.g. Choose to have certified disposal contractor.' },
  ],

  // Module 14: Transport Information - 必填
  module14: [
    { key: 'iataInfo',            label: 'Standards / regulations followed for transportation（运输依据标准/规范）', required: true, placeholder: 'e.g. According to IATA DGR for transportation. Non restricted goods.' },
    { key: 'unNumber',            label: 'UN number（联合国编号）',                                                required: true, placeholder: 'e.g. None' },
    { key: 'riskClassification',  label: 'Risk classification（危险分类）',                                       required: true, placeholder: 'e.g. Non-dangerous goods.' },
    { key: 'landTransport',       label: 'Land Transport ADR/RID regulatory description（公路运输管制说明）',      required: true, placeholder: 'e.g. Not regulated for transport of dangerous goods.' },
    { key: 'maritimeTransport',   label: 'Maritime Transport IMO/IMDG regulatory description（海运管制说明）',    required: true, placeholder: 'e.g. Not regulated for transport of dangerous goods.' },
    { key: 'airTransport',        label: 'Air Transport IATA/ICAO regulatory description（空运管制说明）',        required: true, placeholder: 'e.g. Not regulated for transport of dangerous goods.' },
    { key: 'packagingInfo',       label: 'Product packaging information（产品包装信息）',                         required: true, placeholder: 'e.g. Packing according to customer requirements.' },
    { key: 'transportFashion',    label: 'Supported transport methods（可支持的运输方式）',                       required: true, placeholder: 'e.g. By sea, By air, By rail, By highway' },
    { key: 'transportAttentions', label: 'Core precautions during transportation（运输过程核心注意事项）',        required: true, placeholder: 'e.g. Prevent exposure, rain and high temperature. Keep away from fire.' },
  ],

  // Module 15: Regulatory Information - 必填
  module15: [
    { key: 'regulatoryInfo', label: 'Core safety/health/environmental regulations（核心安全/健康/环境法规含标准编号）', required: true, placeholder: 'e.g. This product is subject to the United States OSHA Hazard Communication Standard (29 CFR 1910.1200).' },
  ],

  // Module 16: Other Information - 选填
  module16: [
    { key: 'references',  label: 'Reference source of this SDS（本数据表的参考文献来源）', required: false, placeholder: 'e.g. Quality department. GHS, OSHA 29 CFR 1910.1200' },
    { key: 'disclaimer',  label: 'Disclaimer content of this SDS（本数据表的免责声明内容）', required: false, placeholder: 'e.g. The information in this SDS was obtained from sources which we believe are reliable...' },
  ],
}

export const EXCEL_TEMPLATE_HEADERS = [
  '产品名称', '品牌', '用途',
  '公司名称', '公司地址', '电话', '紧急电话',
  '外观', '颜色', '气味', 'pH', '沸点', '熔点', '闪点',
  '密度', '粘度', '氧化性', '蒸气压', '水溶性', '蒸气密度',
  '分配系数', '点火温度', '蒸发速率', 'UEL',
  '成分1', 'CAS1', '占比1',
  '成分2', 'CAS2', '占比2',
  '成分3', 'CAS3', '占比3',
]
