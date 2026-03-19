<script setup>
import { ref } from 'vue'
import IngredientTable from './IngredientTable.vue'

const props = defineProps({ loading: { type: Boolean, default: false } })
const emit = defineEmits(['submit'])

const form = ref({
  productName: '',
  brandName: '',
  productUse: '',
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  emergencyPhone: '',
  ingredients: [{ name: '', cas: '', percentage: '' }]
})

function handleSubmit() {
  if (!form.value.productName.trim()) return
  emit('submit', { ...form.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">

    <!-- Product Info -->
    <section>
      <h2 class="text-base font-semibold text-[var(--color-linear-text)] mb-4 pb-2 border-b border-[var(--color-linear-border)]">
        Product Information
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1">
            Product Name <span class="text-red-400">*</span>
          </label>
          <input
            v-model="form.productName"
            required
            placeholder="e.g. Industrial Cleaner Pro"
            class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-linear-border)] bg-[var(--color-linear-surface)] text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)] focus:outline-none focus:border-[var(--color-linear-accent)] transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1">Brand Name</label>
          <input
            v-model="form.brandName"
            placeholder="e.g. CleanMax"
            class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-linear-border)] bg-[var(--color-linear-surface)] text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)] focus:outline-none focus:border-[var(--color-linear-accent)] transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1">Product Use</label>
          <input
            v-model="form.productUse"
            placeholder="e.g. Industrial surface cleaning"
            class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-linear-border)] bg-[var(--color-linear-surface)] text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)] focus:outline-none focus:border-[var(--color-linear-accent)] transition-colors"
          />
        </div>
      </div>
    </section>

    <!-- Company Info -->
    <section>
      <h2 class="text-base font-semibold text-[var(--color-linear-text)] mb-4 pb-2 border-b border-[var(--color-linear-border)]">
        Company / Supplier Information
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1">Company Name</label>
          <input
            v-model="form.companyName"
            placeholder="e.g. Acme Chemical Corp."
            class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-linear-border)] bg-[var(--color-linear-surface)] text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)] focus:outline-none focus:border-[var(--color-linear-accent)] transition-colors"
          />
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1">Company Address</label>
          <input
            v-model="form.companyAddress"
            placeholder="e.g. 123 Industrial Blvd, Houston, TX 77001"
            class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-linear-border)] bg-[var(--color-linear-surface)] text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)] focus:outline-none focus:border-[var(--color-linear-accent)] transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1">Company Phone</label>
          <input
            v-model="form.companyPhone"
            placeholder="e.g. +1-713-555-0100"
            class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-linear-border)] bg-[var(--color-linear-surface)] text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)] focus:outline-none focus:border-[var(--color-linear-accent)] transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-[var(--color-linear-text-secondary)] mb-1">Emergency Phone</label>
          <input
            v-model="form.emergencyPhone"
            placeholder="e.g. CHEMTREC: 1-800-424-9300"
            class="w-full px-4 py-2.5 rounded-lg border border-[var(--color-linear-border)] bg-[var(--color-linear-surface)] text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)] focus:outline-none focus:border-[var(--color-linear-accent)] transition-colors"
          />
        </div>
      </div>
    </section>

    <!-- Ingredients -->
    <section>
      <h2 class="text-base font-semibold text-[var(--color-linear-text)] mb-4 pb-2 border-b border-[var(--color-linear-border)]">
        Ingredients / Composition
      </h2>
      <IngredientTable
        :ingredients="form.ingredients"
        @update:ingredients="form.ingredients = $event"
      />
    </section>

    <!-- Submit -->
    <div class="pt-2">
      <button
        type="submit"
        class="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300"
        style="background: linear-gradient(135deg, #A78BFA, #F472B6);"
        :class="{ 'opacity-60 cursor-not-allowed': !form.productName.trim() || props.loading }"
        :disabled="!form.productName.trim() || props.loading"
      >
        <span v-if="props.loading">Generating...</span>
        <span v-else>Generate SDS Document</span>
      </button>
    </div>

  </form>
</template>
