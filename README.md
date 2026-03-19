# SmartLinkAI — SDS Generator

AI 驱动的美国安全数据表（SDS）生成工具，符合 OSHA 29 CFR 1910.1200 / GHS 标准。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + Vite + Tailwind CSS 4.x |
| 后端 | Node.js + Express |
| AI | Claude claude-sonnet-4-6 (Anthropic) |
| 文档生成 | docx npm 包 |

## 目录结构

```
SmartLinkAI/
├── frontend/          # Vue 3 前端
│   └── src/
│       ├── App.vue
│       ├── components/
│       │   ├── ProductForm.vue      # 产品信息表单
│       │   └── IngredientTable.vue  # 成分动态表格
│       └── composables/
│           └── useTheme.js          # 亮/暗主题切换
├── backend/           # Express 后端
│   ├── server.js
│   ├── routes/generate.js           # POST /api/generate
│   └── services/
│       ├── claude.js                # Claude API 调用
│       └── docxBuilder.js           # .docx 文件构建
├── start.bat          # Windows 一键启动脚本
└── README.md
```

## 启动方式

### 前置条件

- Node.js 18+
- Anthropic API Key

### 方式一：双击启动（推荐）

1. 双击 `start.bat`
2. 首次运行会提示输入 `ANTHROPIC_API_KEY`
3. 自动安装依赖、启动前后端、打开浏览器

### 方式二：手动启动

```bash
# 设置 API Key
set ANTHROPIC_API_KEY=your_key_here

# 启动后端（端口 3001）
cd backend
npm install
node server.js

# 启动前端（端口 5173，新终端）
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

## 使用流程

1. 填写产品名称（必填）、品牌名、用途
2. 填写公司/供应商信息
3. 在成分表中添加化学成分（名称、CAS 号、浓度）
4. 点击 **Generate SDS Document**
5. AI 自动推断危害分类、H 码、P 码及全部 16 节内容
6. 自动下载 `.docx` 文件，用 Word 打开即可

## 输出格式

生成的 SDS 包含 OSHA 标准的 16 个章节：

1. Identification
2. Hazard(s) Identification（AI 推断 GHS 分类、信号词、H/P 码）
3. Composition / Ingredients
4. First-Aid Measures
5. Fire-Fighting Measures
6. Accidental Release Measures
7. Handling and Storage
8. Exposure Controls / Personal Protection
9. Physical and Chemical Properties
10. Stability and Reactivity
11. Toxicological Information
12. Ecological Information
13. Disposal Considerations
14. Transport Information
15. Regulatory Information
16. Other Information

## 部署说明

生产环境建议通过环境变量注入 `ANTHROPIC_API_KEY`，前端 build 后用 nginx 托管静态文件，后端用 PM2 守护进程。
