// SDS 字段定义 - 用于表单验证和展示
export const SDS_FIELDS = {
  basic: [
    { key: 'productName',     label: '产品名称 *',                           required: true,  placeholder: 'e.g. Golf Ball Line Marker Kit' },
    { key: 'brandName',       label: '品牌名称 (Name of Brand)',             required: false, placeholder: 'e.g. Weysat' },
    { key: 'intendedUse',     label: '产品用途 (Relevant identified uses)',  required: false, placeholder: 'e.g. Sports equipment, Painting tool' },
    { key: 'productType',     label: '产品类型 (Product Type)',              required: false, placeholder: 'e.g. Consumer product, Industrial chemical' },
  ],
  company: [
    { key: 'companyName',     label: '公司名称 (Company Name)',              required: false, placeholder: 'Your Company Name' },
    { key: 'companyAddress',  label: '公司地址 (Address)',                   required: false, placeholder: 'Room 606, No.27, Guangjin Road...' },
    { key: 'telephone',       label: '联系电话 (Telephone)',                 required: false, placeholder: '19966180956' },
    { key: 'emergencyPhone',  label: '紧急联系电话 (Emergency Phone)',       required: false, placeholder: '19966180956' },
  ],
  physical: [
    { key: 'appearance',           label: '外观 (Appearance)',                         fullWidth: true,  placeholder: 'e.g. Solid / Liquid / Paste' },
    { key: 'colour',               label: '颜色 (Colour)',                             fullWidth: false, placeholder: 'e.g. Colorful / White / N/A' },
    { key: 'odour',                label: '气味 (Odour)',                              fullWidth: false, placeholder: 'e.g. Odourless / Mild' },
    { key: 'pH',                   label: 'pH',                                        fullWidth: false, placeholder: 'e.g. 7.0 / N/A' },
    { key: 'boilingPoint',         label: '沸点 (Boiling point/range)',                fullWidth: false, placeholder: 'e.g. >100°C / N/A' },
    { key: 'meltingPoint',         label: '熔点 (Melting point/range)',                fullWidth: false, placeholder: 'e.g. N/A' },
    { key: 'flashPoint',           label: '闪点 (Flash point)',                        fullWidth: false, placeholder: 'e.g. >93°C / N/A' },
    { key: 'density',              label: '密度 (Density)',                            fullWidth: false, placeholder: 'e.g. 1.05 g/cm³ / N/A' },
    { key: 'viscosity',            label: '粘度 (Viscosity)',                          fullWidth: false, placeholder: 'e.g. N/A' },
    { key: 'oxidising',            label: '氧化性 (Oxidising properties)',             fullWidth: false, placeholder: 'e.g. No / N/A' },
    { key: 'vapourPressure',       label: '蒸气压 (Vapour pressure)',                  fullWidth: false, placeholder: 'e.g. <0.1 hPa / N/A' },
    { key: 'solubility',           label: '水溶性 (Solubility in water)',              fullWidth: false, placeholder: 'e.g. Slightly soluble / N/A' },
    { key: 'vapourDensity',        label: '蒸气密度 (Vapour density)',                 fullWidth: false, placeholder: 'e.g. N/A' },
    { key: 'partitionCoefficient', label: '分配系数 (Partition coefficient)',          fullWidth: false, placeholder: 'e.g. N/A' },
    { key: 'ignitionTemperature',  label: '点火温度 (Ignition temperature)',           fullWidth: false, placeholder: 'e.g. N/A' },
    { key: 'evaporationRate',      label: '蒸发速率 (Evaporation rate)',               fullWidth: false, placeholder: 'e.g. N/A' },
    { key: 'UEL',                  label: '爆炸上限 (Upper Explosive Limit)',          fullWidth: false, placeholder: 'e.g. N/A' },
  ]
}

export const EXCEL_TEMPLATE_HEADERS = [
  '产品名称', '品牌', '用途', '产品类型',
  '公司名称', '公司地址', '电话', '紧急电话',
  '外观', '颜色', '气味', 'pH', '沸点', '熔点', '闪点',
  '密度', '粘度', '氧化性', '蒸气压', '水溶性', '蒸气密度',
  '分配系数', '点火温度', '蒸发速率', 'UEL',
  '成分1', 'CAS1', '占比1',
  '成分2', 'CAS2', '占比2',
  '成分3', 'CAS3', '占比3',
]
