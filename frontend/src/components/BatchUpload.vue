<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { generateSDS, parseExcelRow } from '../services/gemini.js'
import { generatePDF } from '../utils/pdfGenerator.js'
import { generateWord } from '../utils/wordGenerator.js'
import { EXCEL_TEMPLATE_HEADERS } from '../data/sdsFields.js'

const props = defineProps({
  format: { type: String, default: 'both' }
})

const fileInput = ref(null)
const isDragOver = ref(false)
const batchStatus = ref([])
const isRunning = ref(false)
const progress = ref(0)
const total = ref(0)

function downloadTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([
    EXCEL_TEMPLATE_HEADERS,
    [
      'Golf Ball Line Marker Kit', 'Weysat', 'Sports & Painting', 'Consumer Product',
      'My Company', 'Room 606, Guangjin Road, Dongguan', '19966180956', '19966180956',
      'Solid', 'Colorful', 'Odourless',
      'Pigment Blue 15', '147-14-8', '45',
      'Pigment Yellow 13', '5102-83-0', '20',
      '', '', '',
    ],
  ])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'SDS Batch')
  XLSX.writeFile(wb, 'SDS批量模板.xlsx')
}

function handleDrop(e) {
  isDragOver.value = false
  const file = e.dataTransfer.files[0]
  if (file) processFile(file)
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) processFile(file)
  e.target.value = ''
}

async function processFile(file) {
  if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
    alert('请上传 Excel 文件（.xlsx / .xls / .csv）')
    return
  }

  const buf = await file.arrayBuffer()
  const workbook = XLSX.read(buf, { type: 'array' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  if (!rows.length) {
    alert('Excel 文件为空或格式不正确')
    return
  }

  isRunning.value = true
  batchStatus.value = rows.map((row, i) => ({
    name: String(row['产品名称'] || row['ProductName'] || row['Product Name'] || `Product ${i + 1}`),
    status: 'pending',
    error: '',
  }))
  progress.value = 0
  total.value = rows.length

  for (let i = 0; i < rows.length; i++) {
    batchStatus.value[i].status = 'processing'
    try {
      const productData = parseExcelRow(rows[i], i)
      const sds = await generateSDS(productData)
      if (props.format === 'pdf'  || props.format === 'both') await generatePDF(sds)
      if (props.format === 'word' || props.format === 'both') await generateWord(sds)
      batchStatus.value[i].status = 'done'
    } catch (e) {
      batchStatus.value[i].status = 'error'
      batchStatus.value[i].error = e.message
    }
    progress.value = i + 1
  }

  isRunning.value = false
}
</script>

<template>
  <div class="space-y-5">

    <div class="flex items-center justify-between">
      <p class="text-sm text-[var(--color-linear-text-secondary)]">
        上传 Excel 文件，逐行自动生成 SDS PDF 并下载
      </p>
      <button
        type="button"
        @click="downloadTemplate"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
               border border-[var(--color-linear-border)]
               text-[var(--color-linear-text-secondary)]
               hover:border-[var(--color-linear-accent)] hover:text-[var(--color-linear-accent)]
               transition-all duration-200"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        </svg>
        下载 Excel 模板
      </button>
    </div>

    <!-- Drop Zone -->
    <div
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="handleDrop"
      @click="fileInput.click()"
      class="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl
             border-2 border-dashed cursor-pointer transition-all duration-200"
      :class="isDragOver
        ? 'border-[var(--color-linear-accent)] bg-[var(--color-linear-accent-subtle)]'
        : 'border-[var(--color-linear-border)] hover:border-[var(--color-linear-accent)]/50 hover:bg-[var(--color-linear-bg-secondary)]'"
    >
      <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileChange" />

      <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-200"
           :class="isDragOver ? 'bg-[var(--color-linear-accent)]' : 'bg-[var(--color-linear-bg-secondary)]'">
        <svg class="w-6 h-6 transition-colors duration-200"
             :class="isDragOver ? 'text-white' : 'text-[var(--color-linear-text-tertiary)]'"
             fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
        </svg>
      </div>

      <div class="text-center">
        <p class="text-sm font-medium text-[var(--color-linear-text)]">
          拖拽 Excel 到此处，或<span class="text-[var(--color-linear-accent)]">点击上传</span>
        </p>
        <p class="text-xs text-[var(--color-linear-text-tertiary)] mt-1">
          .xlsx · .xls · .csv，每行一个产品，逐个生成 PDF
        </p>
      </div>
    </div>

    <!-- Progress + Status -->
    <div v-if="batchStatus.length" class="space-y-3 fade-in-up">
      <div v-if="isRunning || progress === total" class="space-y-1">
        <div class="flex items-center justify-between text-xs text-[var(--color-linear-text-secondary)]">
          <span>{{ isRunning ? `正在生成第 ${progress + 1} / ${total}` : `全部完成 ${total} 个` }}</span>
          <span>{{ Math.round(progress / total * 100) }}%</span>
        </div>
        <div class="h-1.5 rounded-full overflow-hidden bg-[var(--color-linear-border)]">
          <div
            class="h-full rounded-full bg-[var(--color-linear-accent)] transition-all duration-500"
            :style="{ width: `${(progress / total) * 100}%` }"
          />
        </div>
      </div>

      <div class="space-y-1.5">
        <div
          v-for="(item, idx) in batchStatus"
          :key="idx"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors duration-200"
          :class="'bg-[var(--color-linear-bg-secondary)] border-[var(--color-linear-border)]'"
        >
          <div class="flex-shrink-0 w-4">
            <svg v-if="item.status === 'processing'" class="w-4 h-4 spinner text-[var(--color-linear-accent)]"
                 fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <svg v-else-if="item.status === 'done'" class="w-4 h-4 text-[var(--color-linear-success)]"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else-if="item.status === 'error'" class="w-4 h-4 text-[var(--color-linear-danger)]"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <div v-else class="w-4 h-4 rounded-full border-2 border-[var(--color-linear-border)]"/>
          </div>

          <span class="flex-1 text-sm text-[var(--color-linear-text)] truncate">{{ item.name }}</span>

          <span v-if="item.status === 'done'" class="text-xs text-[var(--color-linear-success)]">已下载</span>
          <span v-else-if="item.status === 'processing'" class="text-xs text-[var(--color-linear-accent)]">生成中...</span>
          <span v-else-if="item.status === 'error'" class="text-xs text-[var(--color-linear-danger)] max-w-[180px] truncate">{{ item.error }}</span>
          <span v-else class="text-xs text-[var(--color-linear-text-tertiary)]">等待中</span>
        </div>
      </div>
    </div>

  </div>
</template>
