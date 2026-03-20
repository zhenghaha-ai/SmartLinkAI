# SDS Generator — SmartLinkAI

AI 驱动的安全数据表（SDS）自动生成工具。输入产品成分信息，AI 自动生成符合 OSHA 29 CFR 1910.1200 & GHS 标准的完整 SDS PDF 报告。

**纯前端应用，无需后端，直接访问 URL 即可使用。**

## 功能

- **单品生成**：填写产品信息和成分，一键生成并下载 SDS PDF
- **Excel 批量**：拖拽上传 Excel，逐行生成，实时进度显示
- **AI 智能分析**：基于 CAS 编号自动判断危险等级、生成 GHS H/P code
- **亮暗主题**：跟随系统偏好，支持手动切换

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 + Vite 7 + Tailwind CSS 4.x |
| AI | Gemini 2.0 Flash（OpenAI-compatible 接口） |
| PDF 生成 | jsPDF + jspdf-autotable（纯浏览器端） |
| Excel 解析 | xlsx（纯浏览器端） |

## 快速启动

**双击 `start.bat`**（自动检查依赖、检测端口冲突、启动后自动打开浏览器）

**手动启动：**
```bash
cd frontend
npm install
npx vite          # → http://localhost:5173
```

## 部署到公网

构建后将 `dist/` 文件夹部署到任意静态托管：

```bash
cd frontend
npm run build     # 输出到 dist/
```

- **Vercel**：拖拽 `dist/` 到 vercel.com 即可
- **Nginx**：将 `dist/` 内容放到 web 根目录
- **本地预览**：`npx serve dist`

## 目录结构

```
SmartLinkAI/
├── frontend/
│   ├── .env.local              # API Key（不提交到 git）
│   ├── src/
│   │   ├── App.vue             # 主页面
│   │   ├── services/gemini.js  # 直接调用 Gemini API
│   │   ├── utils/pdfGenerator.js # jsPDF 生成 SDS PDF
│   │   ├── components/
│   │   │   ├── ProductForm.vue # 单品表单
│   │   │   └── BatchUpload.vue # Excel 批量
│   │   └── data/sdsFields.js   # 字段定义
│   └── vite.config.js
├── start.bat                   # Windows 一键启动
└── US安全数据表模板（申诉用）.docx  # 参考模板
```

## API 配置

`frontend/.env.local`：

```env
VITE_GEMINI_API_KEY=your-api-key
VITE_GEMINI_BASE_URL=https://api.tu-zi.com/v1
VITE_GEMINI_MODEL=gemini-2.0-flash-preview
```

> ⚠️ 注意：前端直接调用 API，Key 会暴露在浏览器中，适用于内部工具。如需公开部署，请添加后端代理。
