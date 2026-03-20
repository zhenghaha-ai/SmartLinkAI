// SDS 字段定义 - 用于表单验证和展示
export const SDS_FIELDS = {
  basic: [
    { key: 'productName',     label: '产品名称 *',   required: true,  placeholder: 'e.g. Golf Ball Line Marker Kit' },
    { key: 'brandName',       label: '品牌名称',      required: false, placeholder: 'e.g. Weysat' },
    { key: 'intendedUse',     label: '产品用途',      required: false, placeholder: 'e.g. Sports equipment, Painting tool' },
    { key: 'productType',     label: '产品类型',      required: false, placeholder: 'e.g. Consumer product, Industrial chemical' },
  ],
  company: [
    { key: 'companyName',     label: '公司名��',      required: false, placeholder: 'Your Company Name' },
    { key: 'companyAddress',  label: '公司地址',      required: false, placeholder: 'Room 606, No.27, Guangjin Road...' },
    { key: 'telephone',       label: '联系电话',      required: false, placeholder: '19966180956' },
    { key: 'emergencyPhone',  label: '紧急联系电话',  required: false, placeholder: '同上 or 119' },
  ],
  physical: [
    { key: 'appearance',      label: '外观 (Appearance)',  required: false, placeholder: 'Solid / Liquid / Gas' },
    { key: 'colour',          label: '颜色 (Colour)',      required: false, placeholder: 'Colorful / White / N/A' },
    { key: 'odour',           label: '气味 (Odour)',       required: false, placeholder: 'Odourless / Mild / N/A' },
  ]
}

export const EXCEL_TEMPLATE_HEADERS = [
  '产品名称', '品牌', '用途', '产品类型',
  '公司名称', '公司地址', '电话', '紧急电话',
  '外观', '颜色', '气味',
  '成分1', 'CAS1', '占比1',
  '成分2', 'CAS2', '占比2',
  '成分3', 'CAS3', '占比3',
]
