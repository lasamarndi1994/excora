<template>
  <div class="px-6 py-3 d-flex align-center justify-space-between flex-wrap gap-4 border-b bg-surface">
    <div class="d-flex align-center gap-4">
      <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="$emit('close')"></v-btn>
      <h1 class="text-subtitle-1 font-weight-bold mb-0 text-high-emphasis">Decision Detail</h1>
    </div>
    <v-chip size="small" :color="decision.status === 'Approved' ? 'success' : 'warning'" variant="flat"
      class="font-weight-bold px-3 text-white">
      {{ decision.status }}
    </v-chip>
  </div>

  <div class="flex-grow-1 px-8 py-8 overflow-y-auto bg-grey-lighten-5">
    <v-card variant="flat" class="bg-white rounded-lg border pa-8 mx-auto" elevation="0">
      <h2 class="text-h5 font-weight-black mb-6">{{ decision.id }}</h2>

      <div class="font-weight-bold text-body-1 mb-4">Decision Information</div>

      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <div class="text-body-2 mb-2"><span class="text-medium-emphasis font-weight-medium">Decision
              Title:</span> <span class="text-high-emphasis font-weight-bold">{{ decision.title }}</span>
          </div>
          <div class="text-body-2 mb-2"><span class="text-medium-emphasis font-weight-medium">Reason:</span>
            <span class="text-high-emphasis">{{ decision.reason }}</span>
          </div>
          <div class="text-body-2 d-flex align-center gap-2"><span
              class="text-medium-emphasis font-weight-medium">Impact:</span>
            <v-chip size="x-small" :color="impactColor" variant="flat" class="font-weight-bold text-white px-3">{{
              decision.impact }}</v-chip>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="text-body-2 mb-2 d-flex align-start gap-1"><span
              class="text-medium-emphasis font-weight-medium text-no-wrap">Linked Work:</span> <a href="#"
              class="text-primary font-weight-medium text-decoration-underline">{{ decision.linkedWork
              }}</a></div>
          <div class="text-body-2 mb-2"><span class="text-medium-emphasis font-weight-medium">Date:</span>
            <span class="text-high-emphasis">{{ decision.date }}</span>
          </div>
          <div class="text-body-2"><span class="text-medium-emphasis font-weight-medium">Created By:</span>
            <span class="text-high-emphasis font-weight-bold">{{ decision.createdBy.name }}</span>
          </div>
        </v-col>
      </v-row>

      <div class="font-weight-bold text-body-1 mb-3">Decision Made</div>
      <div class="text-body-2 text-high-emphasis mb-6 format-text">{{ decision?.decisionMade || "" }}</div>

      <div v-if="decision.optionsConsidered" class="font-weight-bold text-body-1 mb-3">Options Considered:</div>
      <div v-if="decision.optionsConsidered" class="text-body-2 text-high-emphasis mb-8 format-text">{{
        decision.optionsConsidered }}</div>

      <div class="d-flex justify-end gap-3 pt-6 border-t mt-8">
        <v-btn variant="outlined" class="text-none font-weight-medium border-grey-lighten-1"
          color="medium-emphasis">Print</v-btn>
        <v-btn variant="outlined" class="text-none font-weight-medium border-grey-lighten-1"
          color="medium-emphasis">Download as PDF</v-btn>
        <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6"
          @click="$emit('close')">Close</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Decision } from '@/stores/taskStore'

const props = defineProps<{
  decision: Decision
}>()

defineEmits<{
  (e: 'close'): void
}>()

const impactColor = computed(() => {
  if (props.decision.impact === 'High') return 'error'
  if (props.decision.impact === 'Medium') return 'warning'
  return 'success'
})
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

.format-text {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
