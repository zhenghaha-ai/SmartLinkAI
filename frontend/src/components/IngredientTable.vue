<script setup>
import { ref } from 'vue'

const props = defineProps({
  ingredients: { type: Array, required: true }
})
const emit = defineEmits(['update:ingredients'])

function addRow() {
  emit('update:ingredients', [...props.ingredients, { name: '', cas: '', percentage: '' }])
}

function removeRow(idx) {
  const updated = props.ingredients.filter((_, i) => i !== idx)
  emit('update:ingredients', updated)
}

function updateRow(idx, field, value) {
  const updated = props.ingredients.map((row, i) =>
    i === idx ? { ...row, [field]: value } : row
  )
  emit('update:ingredients', updated)
}
</script>

<template>
  <div>
    <div class="overflow-x-auto rounded-xl border border-[var(--color-linear-border)]">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-[var(--color-linear-bg)]">
            <th class="px-4 py-3 text-left font-semibold text-[var(--color-linear-text-secondary)]">Chemical Name *</th>
            <th class="px-4 py-3 text-left font-semibold text-[var(--color-linear-text-secondary)]">CAS Number</th>
            <th class="px-4 py-3 text-left font-semibold text-[var(--color-linear-text-secondary)]">Concentration (%)</th>
            <th class="px-4 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in ingredients"
            :key="idx"
            class="border-t border-[var(--color-linear-border)] transition-colors hover:bg-[var(--color-linear-bg)]"
          >
            <td class="px-3 py-2">
              <input
                :value="row.name"
                @input="updateRow(idx, 'name', $event.target.value)"
                placeholder="e.g. Sodium Hydroxide"
                class="w-full bg-transparent outline-none text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)]"
              />
            </td>
            <td class="px-3 py-2">
              <input
                :value="row.cas"
                @input="updateRow(idx, 'cas', $event.target.value)"
                placeholder="e.g. 1310-73-2"
                class="w-full bg-transparent outline-none text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)]"
              />
            </td>
            <td class="px-3 py-2">
              <input
                :value="row.percentage"
                @input="updateRow(idx, 'percentage', $event.target.value)"
                placeholder="e.g. 5-10"
                class="w-full bg-transparent outline-none text-[var(--color-linear-text)] placeholder:text-[var(--color-linear-text-secondary)]"
              />
            </td>
            <td class="px-3 py-2 text-center">
              <button
                @click="removeRow(idx)"
                class="text-[var(--color-linear-text-secondary)] hover:text-red-400 transition-colors text-lg leading-none"
                title="Remove row"
              >×</button>
            </td>
          </tr>
          <tr v-if="ingredients.length === 0">
            <td colspan="4" class="px-4 py-6 text-center text-[var(--color-linear-text-secondary)] text-sm">
              No ingredients added yet
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      @click="addRow"
      class="mt-3 flex items-center gap-2 text-sm text-[var(--color-linear-accent)] hover:opacity-80 transition-opacity"
    >
      <span class="text-lg leading-none">+</span> Add Ingredient
    </button>
  </div>
</template>
