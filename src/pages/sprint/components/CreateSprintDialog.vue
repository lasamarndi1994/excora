<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500"
    scroll-strategy="none">
    <v-card class="rounded-lg pa-4">
      <v-card-title class="text-h6 font-weight-bold px-4 pt-2">New Sprint</v-card-title>
      <v-card-text class="pt-4">
        <v-text-field v-model="formData.name" label="Sprint Name" variant="outlined" density="comfortable"
          class="mb-2"></v-text-field>
        <v-select v-model="formData.status" :items="['Draft', 'Active', 'Completed']" label="Status" variant="outlined"
          density="comfortable" class="mb-2"></v-select>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="formData.startDate" label="Start Date" variant="outlined" density="comfortable"
              placeholder="e.g. Jan 1, 2024"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="formData.endDate" label="End Date" variant="outlined" density="comfortable"
              placeholder="e.g. Jan 14, 2024"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="px-4 pb-2">
        <v-spacer></v-spacer>
        <v-btn variant="text" class="text-none" @click="$emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="primary" variant="flat" class="text-none px-4" @click="save">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Sprint } from '@/stores/taskStore'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', data: Omit<Sprint, 'id' | 'taskCount' | 'progress'>): void
}>()

const formData = ref<Omit<Sprint, 'id' | 'taskCount' | 'progress'>>({
  name: '',
  status: 'Draft',
  startDate: '',
  endDate: ''
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    formData.value = {
      name: '',
      status: 'Draft',
      startDate: '',
      endDate: ''
    }
  }
})

const save = () => {
  if (formData.value.name) {
    emit('save', formData.value)
  }
}
</script>
