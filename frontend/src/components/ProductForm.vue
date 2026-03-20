<script setup>
import { ref } from 'vue'
import { SDS_FIELDS } from '../data/sdsFields.js'

const props = defineProps({
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['submit'])

// Form state
const form = ref({
  productName: '',
  brandName: '',
  intendedUse: '',
  productType: '',
  companyName: '',
  companyAddress: '',
  telephone: '',
  emergencyPhone: '',
  appearance: '',
  colour: '',
  odour: '',
  ingredients: [{ component: '', casNumber: '', percentage: '' }]
})

const errors = ref({})

function addIngredient() {
  form.value.ingredients.push({ component: '', casNumber: '', percentage: '' })
}

function removeIngredient(index) {
  if (form.value.ingredients.length > 1) {
    form.value.ingredients.splice(index, 1)
  }
}

function validate() {
  errors.value = {}
  if (!form.value.productName.trim()) {
    errors.value.productName = '产品名称不能为空'
  }
  const hasValidIngredient = form.value.ingredients.some(i => i.component.trim())
  if (!hasValidIngredient) {
    errors.value.ingredients = '至少填写一个成分'
  }
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  const data = {
    ...form.value,
    ingredients: form.value.ingredients.filter(i => i.component.trim())
  }
  emit('submit', data)
}

function handleReset() {
  form.value = {
    productName: '',
    brandName: '',
    intendedUse: '',
    productType: '',
    companyName: '',
    companyAddress: '',
    telephone: '',
    emergencyPhone: '',
    appearance: '',
    colour: '',
    odour: '',
    ingredients: [{ component: '', casNumber: '', percentage: '' }]
  }
  errors.value = {}
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">

    <!-- Basic Info -->
    <section>
      <h3 class="text-xs font-semibold uppercase tracking-widest text-[var(--color-linear-text-tertiary)] mb-3">
        基本信息
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="field in SDS_FIELDS.basic"
          :key="field.key"
          :class="field.key === 'productName' ? 'sm:col-span-2' : ''"
        >
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1.5">
            {{ field.label }}
          </label>
          <input
            v-model="form[field.key]"
            type="text"
            :placeholder="field.placeholder"
            class="w-full px-3 py-2 rounded-lg border text-sm
                   bg-[var(--color-linear-surface)] text-[var(--color-linear-text)]
                   border-[var(--color-linear-border)]
                   placeholder-[var(--color-linear-text-tertiary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-linear-accent)]/40
                   focus:border-[var(--color-linear-accent)]
                   transition-all duration-200"
            :class="{ 'border-[var(--color-linear-danger)] ring-2 ring-[var(--color-linear-danger)]/20': errors[field.key] }"
          />
          <p v-if="errors[field.key]" class="mt-1 text-xs text-[var(--color-linear-danger)]">
            {{ errors[field.key] }}
          </p>
        </div>
      </div>
    </section>

    <!-- Ingredients -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-xs font-semibold uppercase tracking-widest text-[var(--color-linear-text-tertiary)]">
          成分信息 (Ingredients) *
        </h3>
        <button
          type="button"
          @click="addIngredient"
          class="flex items-center gap-1.5 text-xs font-medium
                 text-[var(--color-linear-accent)] hover:text-[var(--color-linear-accent-hover)]
                 transition-colors duration-200"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          添加成分
        </button>
      </div>

      <p v-if="errors.ingredients" class="mb-2 text-xs text-[var(--color-linear-danger)]">
        {{ errors.ingredients }}
      </p>

      <!-- Header row -->
      <div class="hidden sm:grid grid-cols-[1fr_140px_100px_32px] gap-2 mb-1.5 px-1">
        <span class="text-xs text-[var(--color-linear-text-tertiary)]">成分名称 (Component)</span>
        <span class="text-xs text-[var(--color-linear-text-tertiary)]">CAS 编号</span>
        <span class="text-xs text-[var(--color-linear-text-tertiary)]">占比 (%)</span>
        <span></span>
      </div>

      <div class="space-y-2">
        <div
          v-for="(ing, idx) in form.ingredients"
          :key="idx"
          class="grid grid-cols-1 sm:grid-cols-[1fr_140px_100px_32px] gap-2 fade-in-up"
        >
          <input
            v-model="ing.component"
            type="text"
            placeholder="e.g. Pigment Blue 15"
            class="px-3 py-2 rounded-lg border text-sm
                   bg-[var(--color-linear-surface)] text-[var(--color-linear-text)]
                   border-[var(--color-linear-border)]
                   placeholder-[var(--color-linear-text-tertiary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-linear-accent)]/40
                   focus:border-[var(--color-linear-accent)]
                   transition-all duration-200"
          />
          <input
            v-model="ing.casNumber"
            type="text"
            placeholder="e.g. 147-14-8"
            class="px-3 py-2 rounded-lg border text-sm
                   bg-[var(--color-linear-surface)] text-[var(--color-linear-text)]
                   border-[var(--color-linear-border)]
                   placeholder-[var(--color-linear-text-tertiary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-linear-accent)]/40
                   focus:border-[var(--color-linear-accent)]
                   transition-all duration-200"
          />
          <input
            v-model="ing.percentage"
            type="text"
            placeholder="e.g. 45"
            class="px-3 py-2 rounded-lg border text-sm
                   bg-[var(--color-linear-surface)] text-[var(--color-linear-text)]
                   border-[var(--color-linear-border)]
                   placeholder-[var(--color-linear-text-tertiary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-linear-accent)]/40
                   focus:border-[var(--color-linear-accent)]
                   transition-all duration-200"
          />
          <button
            type="button"
            @click="removeIngredient(idx)"
            :disabled="form.ingredients.length === 1"
            class="flex items-center justify-center w-8 h-9 rounded-lg
                   text-[var(--color-linear-text-tertiary)]
                   hover:text-[var(--color-linear-danger)]
                   hover:bg-[var(--color-linear-danger-subtle)]
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Company Info -->
    <section>
      <h3 class="text-xs font-semibold uppercase tracking-widest text-[var(--color-linear-text-tertiary)] mb-3">
        公司信息
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="field in SDS_FIELDS.company"
          :key="field.key"
          :class="field.key === 'companyAddress' ? 'sm:col-span-2' : ''"
        >
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1.5">
            {{ field.label }}
          </label>
          <input
            v-model="form[field.key]"
            type="text"
            :placeholder="field.placeholder"
            class="w-full px-3 py-2 rounded-lg border text-sm
                   bg-[var(--color-linear-surface)] text-[var(--color-linear-text)]
                   border-[var(--color-linear-border)]
                   placeholder-[var(--color-linear-text-tertiary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-linear-accent)]/40
                   focus:border-[var(--color-linear-accent)]
                   transition-all duration-200"
          />
        </div>
      </div>
    </section>

    <!-- Physical Properties -->
    <section>
      <h3 class="text-xs font-semibold uppercase tracking-widest text-[var(--color-linear-text-tertiary)] mb-3">
        物理属性（可选）
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div v-for="field in SDS_FIELDS.physical" :key="field.key">
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1.5">
            {{ field.label }}
          </label>
          <input
            v-model="form[field.key]"
            type="text"
            :placeholder="field.placeholder"
            class="w-full px-3 py-2 rounded-lg border text-sm
                   bg-[var(--color-linear-surface)] text-[var(--color-linear-text)]
                   border-[var(--color-linear-border)]
                   placeholder-[var(--color-linear-text-tertiary)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-linear-accent)]/40
                   focus:border-[var(--color-linear-accent)]
                   transition-all duration-200"
          />
        </div>
      </div>
    </section>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-2">
      <button
        type="button"
        @click="handleReset"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium rounded-lg
               text-[var(--color-linear-text-secondary)]
               hover:text-[var(--color-linear-text)]
               hover:bg-[var(--color-linear-bg-secondary)]
               disabled:opacity-40 disabled:cursor-not-allowed
               transition-all duration-200"
      >
        重置
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg
               bg-[var(--color-linear-accent)] text-white
               hover:bg-[var(--color-linear-accent-hover)]
               disabled:opacity-60 disabled:cursor-not-allowed
               transition-all duration-200 shadow-sm"
      >
        <svg
          v-if="loading"
          class="w-4 h-4 spinner"
          fill="none" viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        {{ loading ? 'AI 生成中...' : '生成 SDS PDF' }}
      </button>
    </div>

  </form>
</template>

<style scoped>
[data-theme="dark"] input {
  background-color: var(--color-linear-surface-dark, #1C1C1F);
  color: var(--color-linear-text-dark, #FAFAFA);
  border-color: var(--color-linear-border-dark, #27272A);
}
[data-theme="dark"] input::placeholder {
  color: var(--color-linear-text-tertiary-dark, #71717A);
}
</style>
