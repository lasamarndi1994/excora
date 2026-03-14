<template>
  <v-container fluid class="pa-0 h-100 d-flex flex-column bg-white overflow-hidden">
    <ProjectHeader active-tab="report" />

    <div class="flex-grow-1 overflow-y-auto bg-grey-lighten-5">
      <!-- Back + Title Bar -->
      <div class="px-8 pt-6 pb-4 bg-white border-b d-flex align-center gap-3">
        <v-btn icon variant="text" size="small" @click="router.push({ name: 'Reports' })">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <div class="text-caption text-medium-emphasis">Reports</div>
          <h2 class="text-h6 font-weight-bold">{{ report?.title }}</h2>
        </div>
        <v-spacer />
        <v-chip v-if="report?.requiresSprints" color="orange" variant="tonal" size="small" label>
          Requires Sprints
        </v-chip>
        <v-btn variant="outlined" size="small" prepend-icon="mdi-download" class="text-capitalize">Export</v-btn>
      </div>

      <div class="px-8 py-6">
        <!-- Burnup Report -->
        <template v-if="reportId === 'burnup'">
          <BurnupReport />
        </template>

        <!-- Sprint Burndown -->
        <template v-else-if="reportId === 'burndown'">
          <BurndownReport />
        </template>

        <!-- Velocity -->
        <template v-else-if="reportId === 'velocity'">
          <VelocityReport />
        </template>

        <!-- CFD -->
        <template v-else-if="reportId === 'cfd'">
          <CfdReport />
        </template>

        <!-- Cycle Time -->
        <template v-else-if="reportId === 'cycletime'">
          <CycleTimeReport />
        </template>

        <!-- Deployment Frequency -->
        <template v-else-if="reportId === 'deployment'">
          <DeploymentReport />
        </template>

        <div v-else class="text-center py-16 text-medium-emphasis">
          <v-icon size="64" class="mb-4">mdi-chart-box-outline</v-icon>
          <div>Report not found.</div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectHeader from '@/components/ProjectHeader.vue'
import BurnupReport from './reports/BurnupReport.vue'
import BurndownReport from './reports/BurndownReport.vue'
import VelocityReport from './reports/VelocityReport.vue'
import CfdReport from './reports/CfdReport.vue'
import CycleTimeReport from './reports/CycleTimeReport.vue'
import DeploymentReport from './reports/DeploymentReport.vue'

const route = useRoute()
const router = useRouter()

const reportId = computed(() => route.params.id as string)

const reportMeta: Record<string, { title: string; requiresSprints: boolean }> = {
  burnup: { title: 'Burnup Report', requiresSprints: true },
  burndown: { title: 'Sprint Burndown Chart', requiresSprints: true },
  velocity: { title: 'Velocity Report', requiresSprints: true },
  cfd: { title: 'Cumulative Flow Diagram', requiresSprints: false },
  cycletime: { title: 'Cycle Time Report', requiresSprints: false },
  deployment: { title: 'Deployment Frequency Report', requiresSprints: false },
}

const report = computed(() => reportMeta[reportId.value])
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.gap-3 {
  gap: 12px;
}
</style>
