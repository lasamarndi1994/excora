<template>
  <div class="report-detail-page">
    <ProjectHeader active-tab="report" />

    <div class="detail-body">
      <!-- Sub-header -->
      <div class="detail-header">
        <button class="back-btn" @click="router.push({ name: 'Reports' })">
          <v-icon size="16">mdi-arrow-left</v-icon>
        </button>
        <div class="header-breadcrumb">
          <span class="breadcrumb-parent">Reports</span>
          <span class="breadcrumb-sep">›</span>
          <span class="breadcrumb-current">{{ report?.title }}</span>
        </div>
        <div class="header-actions">
          <span v-if="report?.requiresSprints" class="sprint-badge">Requires Sprints</span>
          <button class="action-btn">
            <v-icon size="14">mdi-download</v-icon> Export
          </button>
        </div>
      </div>

      <!-- Report Content -->
      <div class="detail-content">
        <BurnupReport     v-if="reportId === 'burnup'"     />
        <BurndownReport   v-else-if="reportId === 'burndown'"   />
        <VelocityReport   v-else-if="reportId === 'velocity'"   />
        <CfdReport        v-else-if="reportId === 'cfd'"        />
        <CycleTimeReport  v-else-if="reportId === 'cycletime'"  />
        <DeploymentReport v-else-if="reportId === 'deployment'" />
        <div v-else class="empty-state">
          <v-icon size="56" color="#cbd5e1">mdi-chart-box-outline</v-icon>
          <div class="empty-text">Report not found.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProjectHeader from '@/components/ProjectHeader.vue'
import BurnupReport    from './reports/BurnupReport.vue'
import BurndownReport  from './reports/BurndownReport.vue'
import VelocityReport  from './reports/VelocityReport.vue'
import CfdReport       from './reports/CfdReport.vue'
import CycleTimeReport from './reports/CycleTimeReport.vue'
import DeploymentReport from './reports/DeploymentReport.vue'

const route  = useRoute()
const router = useRouter()

const reportId = computed(() => route.params.id as string)

const reportMeta: Record<string, { title: string; requiresSprints: boolean }> = {
  burnup:     { title: 'Burnup Report',               requiresSprints: true  },
  burndown:   { title: 'Sprint Burndown Chart',        requiresSprints: true  },
  velocity:   { title: 'Velocity Report',              requiresSprints: true  },
  cfd:        { title: 'Cumulative Flow Diagram',      requiresSprints: false },
  cycletime:  { title: 'Cycle Time Report',            requiresSprints: false },
  deployment: { title: 'Deployment Frequency Report',  requiresSprints: false },
}

const report = computed(() => reportMeta[reportId.value])
</script>

<style scoped>
.report-detail-page {
  display: flex; flex-direction: column; height: 100%;
  font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden;
}
.detail-body { flex: 1; overflow-y: auto; }

/* Sub-header */
.detail-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 24px; background: #fff; border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.back-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
  background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #475569; transition: background .12s;
}
.back-btn:hover { background: #f1f5f9; }
.header-breadcrumb { display: flex; align-items: center; gap: 6px; flex: 1; }
.breadcrumb-parent { font-size: 13px; color: #94a3b8; cursor: pointer; }
.breadcrumb-parent:hover { color: #4f46e5; }
.breadcrumb-sep { color: #cbd5e1; }
.breadcrumb-current { font-size: 14px; font-weight: 700; color: #0f172a; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.sprint-badge {
  background: #fef3c7; color: #d97706;
  font-size: 11px; font-weight: 700; padding: 3px 10px;
  border-radius: 6px; text-transform: uppercase; letter-spacing: .04em;
}
.action-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px;
  border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;
  font-size: 13px; font-weight: 500; color: #475569; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: background .12s;
}
.action-btn:hover { background: #f1f5f9; }

.detail-content { padding: 24px; }

.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 80px 0; gap: 12px;
}
.empty-text { font-size: 14px; color: #94a3b8; }
</style>
