<script setup>
import { ref } from 'vue'
import { SDS_FIELDS } from '../data/sdsFields.js'

const props = defineProps({
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['submit'])

const emptyForm = () => ({
  // Module 1
  productName: '', brandName: '', intendedUse: '', issueDate: '',
  companyName: '', companyAddress: '', telephone: '', emergencyPhone: '',
  // Module 2
  hazardClassification: '', hazardSymbol: '', signalWord: '',
  hazardStatements: '', precautionaryStatements: '',
  hazardResponse: '', hazardStorage: '', hazardDisposal: '',
  // Module 3
  ingredients: [{ component: '', casNumber: '', percentage: '' }],
  // Module 4
  firstAidSkin: '', firstAidEyes: '', firstAidInhalation: '', firstAidIngestion: '',
  // Module 5
  firefightingAgent: '', firefightingDanger: '', firefightingProtection: '',
  // Module 6
  releasePersonal: '', releaseEnvironmental: '', releaseCleanup: '',
  // Module 7
  handlingPrecautions: '', storageConditions: '', storageIncompatibles: '',
  // Module 8
  exposureOEL: '', exposureBiological: '', exposureEngineering: '',
  ppeFace: '', ppeSkin: '', ppeRespiratory: '', ppeThermal: '',
  // Module 9
  appearance: '', colour: '', odour: '', pH: '',
  boilingPoint: '', meltingPoint: '', flashPoint: '',
  density: '', viscosity: '', oxidising: '', vapourPressure: '',
  solubility: '', vapourDensity: '', partitionCoefficient: '',
  ignitionTemperature: '', evaporationRate: '', UEL: '',
  // Module 10
  stability: '', materialsToAvoid: '', conditionsToAvoid: '',
  incompatibleMaterials: '', hazardousPolymerization: '',
  decompositionProducts: '', possibilityOfHazardousReactions: '',
  // Module 11
  acuteToxicity: '', chronicToxicity: '', irritation: '',
  sensitization: '', mutagenicity: '', carcinogenicity: '',
  // Module 12
  ecologicalToxicity: '', persistenceDegradation: '', bioaccumulation: '',
  soilMigration: '', otherHarmfulEffects: '',
  // Module 13
  disposalMethod: '', disposalConsiderations: '',
  // Module 14
  iataInfo: '', unNumber: '', riskClassification: '',
  landTransport: '', maritimeTransport: '', airTransport: '',
  packagingInfo: '', transportFashion: '', transportAttentions: '',
  // Module 15
  regulatoryInfo: '',
  // Module 16
  references: '', disclaimer: '',
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

// 所有模块默认折叠
const openSections = ref(new Set())
function toggleSection(name) {
  if (openSections.value.has(name)) openSections.value.delete(name)
  else openSections.value.add(name)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-2">

    <!-- Module 1 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m1')">
        <span class="section-toggle-title">Module 1 · Identification（产品及供应商标识）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m1') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m1')" class="section-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module1" :key="field.key"
               :class="['productName','companyAddress'].includes(field.key) ? 'sm:col-span-2' : ''">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <input v-model="form[field.key]" type="text" :placeholder="field.placeholder"
                   class="field-input" :class="{ 'field-input--error': errors[field.key] }" />
            <p v-if="errors[field.key]" class="mt-1 text-xs text-[var(--color-linear-danger)]">{{ errors[field.key] }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Module 2 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m2')">
        <span class="section-toggle-title">Module 2 · Hazards Identification（危险性识别）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m2') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m2')" class="section-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module2" :key="field.key"
               :class="['hazardStatements','precautionaryStatements','hazardResponse','hazardStorage','hazardDisposal'].includes(field.key) ? 'sm:col-span-2' : ''">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <textarea v-if="['hazardStatements','precautionaryStatements','hazardResponse','hazardStorage','hazardDisposal'].includes(field.key)"
                      v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
            <input v-else v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 3 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m3')">
        <span class="section-toggle-title">Module 3 · Composition / Ingredients（成分信息）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m3') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m3')" class="section-body">
        <div class="flex items-center justify-between mb-3">
          <p v-if="errors.ingredients" class="text-xs text-[var(--color-linear-danger)]">{{ errors.ingredients }}</p>
          <span v-else class="text-xs text-[var(--color-linear-text-tertiary)]">每个含化工成分的部件填写一行</span>
          <button type="button" @click="addIngredient"
                  class="flex items-center gap-1.5 text-xs font-medium text-[var(--color-linear-accent)]
                         hover:text-[var(--color-linear-accent-hover)] transition-colors">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>添加成分
          </button>
        </div>
        <div class="hidden sm:grid grid-cols-[1fr_140px_100px_32px] gap-2 mb-1.5 px-1">
          <span class="text-xs text-[var(--color-linear-text-tertiary)]"><span class="required-star">*</span>Specific component name（组分名称含颜色/规格）</span>
          <span class="text-xs text-[var(--color-linear-text-tertiary)]"><span class="required-star">*</span>CAS#</span>
          <span class="text-xs text-[var(--color-linear-text-tertiary)]"><span class="required-star">*</span>Weight %</span>
          <span></span>
        </div>
        <div class="space-y-2">
          <div v-for="(ing, idx) in form.ingredients" :key="idx"
               class="grid grid-cols-1 sm:grid-cols-[1fr_140px_100px_32px] gap-2">
            <input v-model="ing.component" type="text" placeholder="e.g. Blue: Pigment Blue 15" class="field-input" />
            <input v-model="ing.casNumber" type="text" placeholder="e.g. 147-14-8" class="field-input" />
            <input v-model="ing.percentage" type="text" placeholder="e.g. 45" class="field-input" />
            <button type="button" @click="removeIngredient(idx)" :disabled="form.ingredients.length === 1"
                    class="flex items-center justify-center w-8 h-9 rounded-lg
                           text-[var(--color-linear-text-tertiary)]
                           hover:text-[var(--color-linear-danger)]
                           hover:bg-[var(--color-linear-danger-subtle)]
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Module 4 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m4')">
        <span class="section-toggle-title">Module 4 · First Aid Measures（急救措施）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m4') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m4')" class="section-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module4" :key="field.key">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 5 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m5')">
        <span class="section-toggle-title">Module 5 · Firefighting Measures（消防措施）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m5') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m5')" class="section-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module5" :key="field.key">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 6 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m6')">
        <span class="section-toggle-title">Module 6 · Accidental Release Measures（泄漏应急处理）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m6') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m6')" class="section-body">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="field in SDS_FIELDS.module6" :key="field.key">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 7 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m7')">
        <span class="section-toggle-title">Module 7 · Handling and Storage（操作与贮存）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m7') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m7')" class="section-body">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="field in SDS_FIELDS.module7" :key="field.key">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 8 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m8')">
        <span class="section-toggle-title">Module 8 · Exposure Controls / Personal Protection（接触控制/个人防护）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m8') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m8')" class="section-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module8" :key="field.key">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <input v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 9 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m9')">
        <span class="section-toggle-title">Module 9 · Physical and Chemical Properties（理化特性）</span>
        <span class="section-badge optional">选填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m9') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m9')" class="section-body">
        <p class="text-xs text-[var(--color-linear-text-tertiary)] mb-3">无数据可填 "No relevant data"，AI 将根据成分自动推断</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module9" :key="field.key"
               :class="field.fullWidth ? 'sm:col-span-2' : ''">
            <label class="field-label">{{ field.label }}</label>
            <input v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 10 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m10')">
        <span class="section-toggle-title">Module 10 · Stability and Reactivity（稳定性和反应性）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m10') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m10')" class="section-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module10" :key="field.key">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 11 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m11')">
        <span class="section-toggle-title">Module 11 · Toxicological Information（毒理学信息）</span>
        <span class="section-badge optional">选填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m11') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m11')" class="section-body">
        <p class="text-xs text-[var(--color-linear-text-tertiary)] mb-3">无数据可填 "No relevant data"，AI 将根据成分自动推断</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module11" :key="field.key">
            <label class="field-label">{{ field.label }}</label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 12 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m12')">
        <span class="section-toggle-title">Module 12 · Ecological Information（生态学信息）</span>
        <span class="section-badge optional">选填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m12') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m12')" class="section-body">
        <p class="text-xs text-[var(--color-linear-text-tertiary)] mb-3">无数据可填 "No relevant data"，AI 将根据成分自动推断</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module12" :key="field.key">
            <label class="field-label">{{ field.label }}</label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 13 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m13')">
        <span class="section-toggle-title">Module 13 · Disposal Considerations（废弃处置）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m13') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m13')" class="section-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module13" :key="field.key">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 14 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m14')">
        <span class="section-toggle-title">Module 14 · Transport Information（运输信息）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m14') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m14')" class="section-body">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="field in SDS_FIELDS.module14" :key="field.key"
               :class="['iataInfo','transportAttentions'].includes(field.key) ? 'sm:col-span-2' : ''">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <input v-model="form[field.key]" type="text" :placeholder="field.placeholder" class="field-input" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 15 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m15')">
        <span class="section-toggle-title">Module 15 · Regulatory Information（法规信息）</span>
        <span class="section-badge required">必填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m15') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m15')" class="section-body">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="field in SDS_FIELDS.module15" :key="field.key">
            <label class="field-label">
              <span v-if="field.required" class="required-star">*</span>{{ field.label }}
            </label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="3" class="field-textarea" />
          </div>
        </div>
      </div>
    </section>

    <!-- Module 16 -->
    <section class="section-card">
      <button type="button" class="section-toggle" @click="toggleSection('m16')">
        <span class="section-toggle-title">Module 16 · Other Information（其他信息）</span>
        <span class="section-badge optional">选填</span>
        <svg class="section-chevron" :class="{ 'rotate-180': openSections.has('m16') }"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div v-show="openSections.has('m16')" class="section-body">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="field in SDS_FIELDS.module16" :key="field.key">
            <label class="field-label">{{ field.label }}</label>
            <textarea v-model="form[field.key]" :placeholder="field.placeholder" rows="2" class="field-textarea" />
          </div>
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

.section-card {
  @apply rounded-xl border border-[var(--color-linear-border)] overflow-hidden;
  background: var(--color-linear-surface);
}
.section-toggle {
  @apply w-full flex items-center gap-2 px-4 py-3 text-left
         hover:bg-[var(--color-linear-bg-secondary)] transition-colors duration-200 cursor-pointer;
}
.section-toggle-title {
  @apply text-xs font-semibold uppercase tracking-widest text-[var(--color-linear-text-secondary)] flex-1;
}
.section-badge {
  @apply text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0;
}
.section-badge.required {
  @apply bg-[var(--color-linear-accent-subtle)] text-[var(--color-linear-accent)];
}
.section-badge.optional {
  @apply bg-[var(--color-linear-bg-secondary)] text-[var(--color-linear-text-tertiary)];
}
.section-chevron {
  @apply w-4 h-4 text-[var(--color-linear-text-tertiary)] transition-transform duration-200 flex-shrink-0;
}
.section-body {
  @apply px-4 pb-4 pt-3 border-t border-[var(--color-linear-border)];
}
.required-star {
  @apply text-[var(--color-linear-danger)] mr-0.5;
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
</style>
