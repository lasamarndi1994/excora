<template>
  <div class="reports-page">
    <ProjectHeader active-tab="report" />

    <div class="reports-body">
      <div class="reports-header">
        <div>
          <div class="page-title">Reports</div>
          <div class="page-sub">{{ reports.length }} report types available</div>
        </div>
      </div>

      <div class="reports-grid">
        <div
          v-for="report in reports"
          :key="report.title"
          class="report-card"
          @click="openReport(report.imgClass)"
        >
          <!-- Chart Preview -->
          <div class="chart-preview">
            <!-- Burnup -->
            <svg v-if="report.imgClass === 'burnup'" width="100%" height="100%" viewBox="0 0 120 70" preserveAspectRatio="none">
              <path d="M0,60 L20,60 L20,45 L50,45 L50,30 L80,30 L80,15 L120,15" fill="none" stroke="#c7d2fe" stroke-width="2"/>
              <path d="M0,50 L30,50 L40,35 L70,25 L100,20 L120,10" fill="none" stroke="#4f46e5" stroke-width="2.5"/>
            </svg>
            <!-- Burndown -->
            <svg v-else-if="report.imgClass === 'burndown'" width="100%" height="100%" viewBox="0 0 120 70" preserveAspectRatio="none">
              <path d="M0,5 L120,65" fill="none" stroke="#c7d2fe" stroke-width="2" stroke-dasharray="4 3"/>
              <path d="M0,5 L20,8 L40,20 L55,18 L75,35 L95,30 L120,60" fill="none" stroke="#4f46e5" stroke-width="2.5"/>
            </svg>
            <!-- Velocity -->
            <svg v-else-if="report.imgClass === 'velocity'" width="100%" height="100%" viewBox="0 0 120 70" preserveAspectRatio="none">
              <rect x="5"  y="30" width="14" height="40" rx="3" fill="#c7d2fe"/>
              <rect x="25" y="20" width="14" height="50" rx="3" fill="#4f46e5"/>
              <rect x="45" y="10" width="14" height="60" rx="3" fill="#c7d2fe"/>
              <rect x="65" y="25" width="14" height="45" rx="3" fill="#4f46e5"/>
              <rect x="85" y="5"  width="14" height="65" rx="3" fill="#c7d2fe"/>
              <rect x="105" y="18" width="14" height="52" rx="3" fill="#4f46e5"/>
              <line x1="0" y1="22" x2="120" y2="22" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2"/>
            </svg>
            <!-- CFD -->
            <svg v-else-if="report.imgClass === 'cfd'" width="100%" height="100%" viewBox="0 0 120 70" preserveAspectRatio="none">
              <path d="M0,70 L0,50 Q30,40 60,35 T120,20 L120,70 Z" fill="#c7d2fe" opacity=".7"/>
              <path d="M0,70 L0,58 Q30,52 60,48 T120,38 L120,70 Z" fill="#818cf8" opacity=".7"/>
              <path d="M0,70 L0,65 Q30,62 60,60 T120,55 L120,70 Z" fill="#4f46e5" opacity=".8"/>
            </svg>
            <!-- Cycle Time -->
            <svg v-else-if="report.imgClass === 'cycletime'" width="100%" height="100%" viewBox="0 0 120 70" preserveAspectRatio="none">
              <line x1="0" y1="35" x2="120" y2="35" stroke="#c7d2fe" stroke-width="1.5" stroke-dasharray="4 3"/>
              <circle cx="15" cy="28" r="4" fill="#4f46e5"/>
              <circle cx="35" cy="20" r="4" fill="#4f46e5"/>
              <circle cx="55" cy="42" r="4" fill="#4f46e5"/>
              <circle cx="75" cy="15" r="4" fill="#ef4444"/>
              <circle cx="95" cy="38" r="4" fill="#4f46e5"/>
              <circle cx="110" cy="25" r="4" fill="#4f46e5"/>
            </svg>
            <!-- Deployment -->
            <svg v-else-if="report.imgClass === 'deployment'" width="100%" height="100%" viewBox="0 0 120 70" preserveAspectRatio="none">
              <rect x="5"  y="35" width="14" height="35" rx="3" fill="#c7d2fe"/>
              <rect x="25" y="28" width="14" height="42" rx="3" fill="#c7d2fe"/>
              <rect x="45" y="20" width="14" height="50" rx="3" fill="#c7d2fe"/>
              <rect x="65" y="30" width="14" height="40" rx="3" fill="#c7d2fe"/>
              <rect x="85" y="15" width="14" height="55" rx="3" fill="#22c55e"/>
              <rect x="105" y="25" width="14" height="45" rx="3" fill="#c7d2fe"/>
              <path d="M0,45 Q30,38 60,40 T120,30" fill="none" stroke="#4f46e5" stroke-width="2"/>
            </svg>

            <span v-if="report.requiresSprints" class="sprint-badge">Requires Sprints</span>
          </div>

          <div class="report-info">
            <div class="report-title">{{ report.title }}</div>
            <div class="report-desc">{{ report.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProjectHeader from '@/components/ProjectHeader.vue'

const router = useRouter()
const openReport = (id: string) => router.push({ name: 'ReportDetail', params: { id } })

const reports = ref([
  { title: 'Burnup report',                imgClass: 'burnup',     requiresSprints: true,  desc: "Visualise a sprint's completed work vs total scope to track progress." },
  { title: 'Sprint burndown chart',        imgClass: 'burndown',   requiresSprints: true,  desc: "Track total work remaining within a sprint and summarise team performance." },
  { title: 'Velocity report',              imgClass: 'velocity',   requiresSprints: true,  desc: "Predict future sprint capacity by reviewing value delivered in previous ones." },
  { title: 'Cumulative flow diagram',      imgClass: 'cfd',        requiresSprints: false, desc: "Shows work item statuses over time to identify bottlenecks in your workflow." },
  { title: 'Cycle Time Report',            imgClass: 'cycletime',  requiresSprints: false, desc: "Understand how long it takes to ship work items through the deployment pipeline." },
  { title: 'Deployment Frequency Report',  imgClass: 'deployment', requiresSprints: false, desc: "Understand your deployment frequency and how often you ship value to customers." },
])
</script>

<style scoped>
.reports-page {
  display: flex; flex-direction: column; height: 100%;
  font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden;
}
.reports-body { flex: 1; overflow-y: auto; padding: 24px; }
.reports-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
}
.page-title { font-size: 18px; font-weight: 800; color: #0f172a; }
.page-sub { font-size: 12.5px; color: #94a3b8; margin-top: 2px; }

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}
.report-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
  overflow: hidden; cursor: pointer;
  transition: box-shadow .18s, transform .18s;
  animation: fadeUp .3s ease both;
}
.report-card:hover {
  box-shadow: 0 8px 28px rgba(79,70,229,.12);
  transform: translateY(-3px);
}
.chart-preview {
  height: 130px; background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  position: relative; padding: 16px;
  display: flex; align-items: center; justify-content: center;
}
.chart-preview svg { width: 100%; height: 100%; }
.sprint-badge {
  position: absolute; bottom: 8px; right: 8px;
  background: #fef3c7; color: #d97706;
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: 4px; text-transform: uppercase; letter-spacing: .04em;
}
.report-info { padding: 16px; }
.report-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.report-desc { font-size: 12.5px; color: #64748b; line-height: 1.5; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
