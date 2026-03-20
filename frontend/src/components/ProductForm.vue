<script setup>
import { ref } from 'vue'
import { SDS_FIELDS } from '../data/sdsFields.js'

const props = defineProps({
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['submit'])

const emptyForm = () => ({
  // Section 1
  issueDate: '', productName: '', brandName: '', intendedUse: '', productType: '',
  // Company
  companyName: '', companyAddress: '', telephone: '', emergencyPhone: '',
  // Section 2
  hazardClassification: '', signalWord: '', hazardStatements: '',
  precautionaryStatement1: '', precautionaryStatement2: '',
  precautionaryStatement3: '', precautionaryStatement4: '',
  hazardResponse: '', hazardStorage: '', hazardDisposal: '',
  // Section 3
  ingredients: [{ component: '', casNumber: '', percentage: '' }],
  // Section 4
  firstAidSkin: '', firstAidEyes: '', firstAidInhalation: '', firstAidIngestion: '',
  // Section 5
  firefightingAgent: '', firefightingDanger: '', firefightingProtection: '',
  // Section 6
  releasePersonal: '', releaseEnvironmental: '', releaseCleanup: '',
  // Section 7
  handlingPrecautions: '', storageConditions: '',
  // Section 8
  exposureOEL: '', exposureBiological: '', exposureEngineering: '',
  ppeFace: '', ppeSkin: '', ppeRespiratory: '', ppeThermal: '',
  // Section 9
  appearance: '', colour: '', odour: '', pH: '',
  boilingPoint: '', meltingPoint: '', flashPoint: '',
  density: '', viscosity: '', oxidising: '', vapourPressure: '',
  solubility: '', vapourDensity: '', partitionCoefficient: '',
  ignitionTemperature: '', evaporationRate: '', UEL: '',
  // Section 10
  stability: '', materialsToAvoid: '', conditionsToAvoid: '', incompatibleMaterials: '',
  hazardousPolymerization: '', decompositionProducts: '',
  // Section 11
  acuteToxicity: '', chronicToxicity: '', irritation: '',
  sensitization: '', mutagenicity: '', carcinogenicity: '',
  // Section 12
  ecologicalToxicity: '', persistenceDegradation: '', bioaccumulation: '',
  soilMigration: '', otherHarmfulEffects: '',
  // Section 13
  disposalMethod: '', disposalConsiderations: '',
  // Section 14
  iataInfo: '', unNumber: '', riskClassification: '',
  landTransport: '', maritimeTransport: '', airTransport: '',
  packagingInfo: '', transportFashion: '', transportAttentions: '',
  // Section 15
  regulatoryInfo: '',
  // Section 16
  references: '',
})

const form = ref(emptyForm())
const errors = ref({})

function addIngredient() {
  form.value.ingredients.push({ component: '', casNumber: '', percentage: '' })
}
function removeIngredient(index) {
  if (form.value.ingredients.length > 1) form.value.ingredients.splice(index, 1)
}
function validate() {
  errors.value = {}
  if (!form.value.productName.trim()) errors.value.productName = '产品名称不能为空'
  if (!form.value.ingredients.some(i => i.component.trim())) errors.value.ingredients = '至少填写一个成分'
  return Object.keys(errors.value).length === 0
}
function handleSubmit() {
  if (!validate()) return
  emit('submit', { ...form.value, ingredients: form.value.ingredients.filter(i => i.component.trim()) })
}
function handleReset() {
  form.value = emptyForm()
  errors.value = {}
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">

    <!-- Section 1: 基本信息 -->
    <section>
      <h3 class="section-heading">Section 1 · 产品标识</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.basic" :key="field.key"
             :class="field.key === 'productName' ? 'sm:col-span-2' : ''">
          <label class="field-label">{{ field.label }}</label>
          <input v-model="form[field.key]" type="text" :placeholder="field.placeholder"
                 class="field-input" :class="{ 'field-input--error': errors[field.key] }" />
          <p v-if="errors[field.key]" class="mt-1 text-xs text-[var(--color-linear-danger)]">{{ errors[field.key] }}</p>
        </div>
      </div>
    </section>

    <!-- 供应商信息 -->
    <section>
      <h3 class="section-heading">供应商信息 (Supplier Details)</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.company" :key="field.key"
             :class="field.key === 'companyAddress' ? 'sm:col-span-2' : ''">
          <label class="field-label">{{ field.label }}</label>
          <input v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
        </div>
      </div>
    </section>

    <!-- Section 2: 危险标识 -->
    <section>
      <h3 class="section-heading">Section 2 · 危险标识</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.hazard" :key="field.key"
             :class="['hazardStatements','hazardResponse','hazardStorage','hazardDisposal'].includes(field.key) ? 'sm:col-span-2' : ''">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-if="['hazardStatements','hazardResponse','hazardStorage','hazardDisposal'].includes(field.key)"
                    v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          <input v-else v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
        </div>
      </div>
    </section>

    <!-- Section 3: 成分 -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h3 class="section-heading !mb-0">Section 3 · 成分信息 (Composition / Ingredients) *</h3>
        <button type="button" @click="addIngredient"
                class="flex items-center gap-1.5 text-xs font-medium text-[var(--color-linear-accent)] hover:text-[var(--color-linear-accent-hover)] transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>添加成分
        </button>
      </div>
      <p v-if="errors.ingredients" class="mb-2 text-xs text-[var(--color-linear-danger)]">{{ errors.ingredients }}</p>
      <div class="hidden sm:grid grid-cols-[1fr_140px_100px_32px] gap-2 mb-1.5 px-1">
        <span class="text-xs text-[var(--color-linear-text-tertiary)]">成分名称 (Component)</span>
        <span class="text-xs text-[var(--color-linear-text-tertiary)]">CAS 编号</span>
        <span class="text-xs text-[var(--color-linear-text-tertiary)]">占比 (%)</span>
        <span></span>
      </div>
      <div class="space-y-2">
        <div v-for="(ing, idx) in form.ingredients" :key="idx"
             class="grid grid-cols-1 sm:grid-cols-[1fr_140px_100px_32px] gap-2">
          <input v-model="ing.component" type="text" placeholder="e.g. Pigment Blue 15" class="field-input" />
          <input v-model="ing.casNumber" type="text" placeholder="e.g. 147-14-8" class="field-input" />
          <input v-model="ing.percentage" type="text" placeholder="e.g. 45" class="field-input" />
          <button type="button" @click="removeIngredient(idx)" :disabled="form.ingredients.length === 1"
                  class="flex items-center justify-center w-8 h-9 rounded-lg text-[var(--color-linear-text-tertiary)]
                         hover:text-[var(--color-linear-danger)] hover:bg-[var(--color-linear-danger-subtle)]
                         disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Section 4: 急救措施 -->
    <section>
      <h3 class="section-heading">Section 4 · 急救措施</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.firstAid" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Section 5: 消防措施 -->
    <section>
      <h3 class="section-heading">Section 5 · 消防措施</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.firefighting" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Section 6: 泄漏应急处理 -->
    <section>
      <h3 class="section-heading">Section 6 · 泄漏应急处理</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.accidentalRelease" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Section 7: 操作和储存 -->
    <section>
      <h3 class="section-heading">Section 7 · 操作和储存</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="field in SDS_FIELDS.handling" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Section 8: 接触控制/个人防护 -->
    <section>
      <h3 class="section-heading">Section 8 · 接触控制 / 个人防护</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.exposure" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <input v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
        </div>
      </div>
    </section>

    <!-- Section 9: 物理化学属性 -->
    <section>
      <h3 class="section-heading">Section 9 · 物理和化学属性</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.physical" :key="field.key"
             :class="field.fullWidth ? 'sm:col-span-2' : ''">
          <label class="field-label">{{ field.label }}</label>
          <input v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
        </div>
      </div>
    </section>

    <!-- Section 10: 稳定性和反应性 -->
    <section>
      <h3 class="section-heading">Section 10 · 稳定性和反应性</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.stability" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Section 11: 毒理学信息 -->
    <section>
      <h3 class="section-heading">Section 11 · 毒理学信息</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.toxicology" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Section 12: 生态学信息 -->
    <section>
      <h3 class="section-heading">Section 12 · 生态学信息</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.ecology" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Section 13: 废弃处置 -->
    <section>
      <h3 class="section-heading">Section 13 · 废弃处置</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.disposal" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Section 14: 运输信息 -->
    <section>
      <h3 class="section-heading">Section 14 · 运输信息</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="field in SDS_FIELDS.transport" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <input v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
        </div>
      </div>
    </section>

    <!-- Section 15 & 16 -->
    <section>
      <h3 class="section-heading">Section 15–16 · 法规信息 & 其他</h3>
      <p class="optional-hint">选填，AI 将根据成分推断；填写可覆盖 AI 推断值</p>
      <div class="grid grid-cols-1 gap-4">
        <div v-for="field in [...SDS_FIELDS.regulatory, ...SDS_FIELDS.other]" :key="field.key">
          <label class="field-label">{{ field.label }}</label>
          <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
        </div>
      </div>
    </section>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-2">
      <button type="button" @click="handleReset" :disabled="loading"
              class="px-4 py-2 text-sm font-medium rounded-lg text-[var(--color-linear-text-secondary)]
                     hover:text-[var(--color-linear-text)] hover:bg-[var(--color-linear-bg-secondary)]
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        重置
      </button>
      <button type="submit" :disabled="loading"
              class="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg
                     bg-[var(--color-linear-accent)] text-white hover:bg-[var(--color-linear-accent-hover)]
                     disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm">
        <svg v-if="loading" class="w-4 h-4 spinner" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        {{ loading ? 'AI 生成中...' : '生成 SDS' }}
      </button>
    </div>

  </form>
</template>

<style scoped>
@reference "../style.css";

.section-heading {
  @apply text-xs font-semibold uppercase tracking-widest text-[var(--color-linear-text-tertiary)] mb-3;
}
.optional-hint {
  @apply text-xs text-[var(--color-linear-text-tertiary)] -mt-1 mb-3;
}
.field-label {
  @apply block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1.5;
}
.field-input {
  @apply w-full px-3 py-2 rounded-lg border text-sm
         bg-[var(--color-linear-surface)] text-[var(--color-linear-text)]
         border-[var(--color-linear-border)]
         placeholder-[var(--color-linear-text-tertiary)]
         focus:outline-none focus:ring-2 focus:ring-[var(--color-linear-accent)]/40
         focus:border-[var(--color-linear-accent)]
         transition-all duration-200;
}
.field-input--error {
  @apply border-[var(--color-linear-danger)] ring-2 ring-[var(--color-linear-danger)]/20;
}
.field-textarea {
  @apply w-full px-3 py-2 rounded-lg border text-sm resize-none
         bg-[var(--color-linear-surface)] text-[var(--color-linear-text)]
         border-[var(--color-linear-border)]
         placeholder-[var(--color-linear-text-tertiary)]
         focus:outline-none focus:ring-2 focus:ring-[var(--color-linear-accent)]/40
         focus:border-[var(--color-linear-accent)]
         transition-all duration-200;
}
[data-theme="dark"] .field-input,
[data-theme="dark"] .field-textarea {
  background-color: var(--color-linear-surface-dark, #1C1C1F);
  color: var(--color-linear-text-dark, #FAFAFA);
  border-color: var(--color-linear-border-dark, #27272A);
}
[data-theme="dark"] .field-input::placeholder,
[data-theme="dark"] .field-textarea::placeholder {
  color: var(--color-linear-text-tertiary-dark, #71717A);
}
</style>
