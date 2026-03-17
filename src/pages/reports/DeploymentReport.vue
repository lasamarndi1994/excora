<template>
  <div class="report-wrap">
    <div class="report-controls">
      <div class="control-group">
        <label class="control-label">Period</label>
        <select v-model="period" class="control-select">
          <option v-for="p in ['Weekly','Monthly','Quarterly']" :key="p">{{ p }}</option>
        </select>
      </div>
      <div class="stat-chips">
        <span class="chip chip-green">Total: {{ totalDeploys }}</span>
        <span class="chip chip-blue">Success Rate: {{ successRate }}%</span>
        <span class="chip chip-red">Failed: {{ failedDeploys }}</span>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-card-header">
        <span class="chart-card-title">Deployment Frequency</span>
        <div class="legend">
          <span class="legend-item"><span class="legend-dot" style="background:#22c55e"></span>Success</span>
          <span class="legend-item"><span class="legend-dot" style="background:#ef4444"></span>Failed</span>
          <span class="legend-item"><span class="legend-line" style="border-top:2px dashed #4f46e5"></span>Trend</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`" class="chart-svg">
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#f1f5f9" stroke-width="1.5"/>
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#94a3b8">{{ y }}</text>
        <g v-for="(d,i) in data" :key="i">
          <rect :x="barX(i)" :y="yS(d.success)" :width="barW" :height="yS(0)-yS(d.success)" fill="#22c55e" rx="4"/>
          <rect :x="barX(i)" :y="yS(d.success+d.failed)" :width="barW" :height="yS(0)-yS(d.failed)" fill="#ef4444" rx="4" opacity=".7"/>
          <text :x="barX(i)+barW/2" :y="chartH-8" text-anchor="middle" font-size="10" fill="#94a3b8">{{ d.label }}</text>
        </g>
        <polyline :points="trendPts" fill="none" stroke="#4f46e5" stroke-width="2" stroke-dasharray="5 3"/>
        <circle v-for="(d,i) in data" :key="'t'+i" :cx="barX(i)+barW/2" :cy="yS(d.success+d.failed)" r="3.5" fill="#4f46e5" stroke="white" stroke-width="1.5"/>
      </svg>
    </div>

    <!-- DORA Metrics -->
    <div class="dora-grid">
      <div v-for="m in doraMetrics" :key="m.label" class="dora-card" :style="`border-top:3px solid ${m.color}`">
        <div class="dora-icon" :style="`background:${m.bg}`">
          <v-icon :color="m.color" size="20">{{ m.icon }}</v-icon>
        </div>
        <div class="dora-value">{{ m.value }}</div>
        <div class="dora-label">{{ m.label }}</div>
        <span class="dora-badge" :class="`badge-${m.rating.toLowerCase()}`">{{ m.rating }}</span>
      </div>
    </div>

    <!-- Recent Deployments -->
    <div class="table-card">
      <div class="table-title">Recent Deployments</div>
      <table class="data-table">
        <thead><tr><th>Version</th><th>Environment</th><th>Date</th><th>Duration</th><th>Status</th><th>Deployed By</th></tr></thead>
        <tbody>
          <tr v-for="d in recentDeploys" :key="d.version">
            <td class="font-medium">{{ d.version }}</td>
            <td><span class="env-badge" :class="`env-${d.env.toLowerCase()}`">{{ d.env }}</span></td>
            <td class="text-muted">{{ d.date }}</td>
            <td>{{ d.duration }}</td>
            <td><span class="status-badge" :class="d.status==='Success'?'badge-green':'badge-red'">{{ d.status }}</span></td>
            <td class="text-muted">{{ d.by }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const period = ref('Weekly')
const chartW = 700, chartH = 260, padL = 55, padR = 20, padT = 20, padB = 30, maxVal = 12
const yGrid = [0,3,6,9,12]
const data = [
  {label:'W1',success:5,failed:1},{label:'W2',success:7,failed:0},{label:'W3',success:4,failed:2},
  {label:'W4',success:8,failed:1},{label:'W5',success:6,failed:0},{label:'W6',success:9,failed:1},
  {label:'W7',success:7,failed:2},{label:'W8',success:10,failed:0},
]
const groupW = (chartW-padL-padR)/data.length
const barW = Math.min(groupW*0.55, 36)
function barX(i: number) { return padL+i*groupW+(groupW-barW)/2 }
function yS(v: number) { return padT+(1-v/maxVal)*(chartH-padT-padB) }
const trendPts = computed(() => data.map((d,i) => `${barX(i)+barW/2},${yS(d.success+d.failed)}`).join(' '))
const totalDeploys  = computed(() => data.reduce((a,d)=>a+d.success+d.failed,0))
const failedDeploys = computed(() => data.reduce((a,d)=>a+d.failed,0))
const successRate   = computed(() => Math.round(((totalDeploys.value-failedDeploys.value)/totalDeploys.value)*100))
const doraMetrics = [
  { label:'Deploy Frequency',   value:'8/week',  icon:'mdi-rocket-launch', color:'#22c55e', bg:'#dcfce7', rating:'Elite'  },
  { label:'Lead Time',          value:'1.2 days', icon:'mdi-clock-fast',   color:'#3b82f6', bg:'#dbeafe', rating:'High'   },
  { label:'Change Failure Rate',value:'8%',       icon:'mdi-alert-circle', color:'#f97316', bg:'#fef3c7', rating:'Medium' },
  { label:'MTTR',               value:'45 min',   icon:'mdi-restore',      color:'#8b5cf6', bg:'#ede9fe', rating:'High'   },
]
const recentDeploys = [
  { version:'v2.4.1', env:'Production', date:'Mar 14, 2026', duration:'4m 12s', status:'Success', by:'Lasam'     },
  { version:'v2.4.0', env:'Production', date:'Mar 12, 2026', duration:'3m 58s', status:'Success', by:'Alana Song'},
  { version:'v2.3.9', env:'Staging',    date:'Mar 11, 2026', duration:'2m 30s', status:'Failed',  by:'Mitch'     },
  { version:'v2.3.8', env:'Production', date:'Mar 10, 2026', duration:'4m 05s', status:'Success', by:'Rupert'    },
  { version:'v2.3.7', env:'Dev',        date:'Mar 9, 2026',  duration:'1m 45s', status:'Success', by:'Lasam'     },
]
</script>

<style scoped>
.report-wrap { display: flex; flex-direction: column; gap: 20px; font-family: 'Inter', sans-serif; }
.report-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.control-group { display: flex; align-items: center; gap: 8px; }
.control-label { font-size: 13px; font-weight: 600; color: #374151; }
.control-select { padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1e293b; background: #fff; outline: none; font-family: 'Inter', sans-serif; cursor: pointer; min-width: 160px; }
.stat-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { padding: 4px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 600; }
.chip-green { background: #dcfce7; color: #15803d; }
.chip-blue  { background: #dbeafe; color: #1d4ed8; }
.chip-red   { background: #fee2e2; color: #dc2626; }
.chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
.chart-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.chart-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748b; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-line { display: inline-block; width: 24px; }
.chart-svg { display: block; }
.dora-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.dora-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
.dora-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.dora-value { font-size: 20px; font-weight: 800; color: #0f172a; }
.dora-label { font-size: 12px; color: #64748b; }
.dora-badge { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.badge-elite  { background: #dcfce7; color: #15803d; }
.badge-high   { background: #dbeafe; color: #1d4ed8; }
.badge-medium { background: #fef3c7; color: #d97706; }
.table-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.table-title { font-size: 14px; font-weight: 700; color: #0f172a; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.data-table td { padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #374151; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #f8fafc; }
.font-medium { font-weight: 600; }
.text-muted  { color: #94a3b8; font-size: 12.5px; }
.env-badge, .status-badge { padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
.env-production { background: #fee2e2; color: #dc2626; }
.env-staging    { background: #fef3c7; color: #d97706; }
.env-dev        { background: #dbeafe; color: #1d4ed8; }
.badge-green { background: #dcfce7; color: #15803d; }
.badge-red   { background: #fee2e2; color: #dc2626; }
@media (max-width: 640px) {
  .dora-grid { grid-template-columns: repeat(2, 1fr); }
  .chart-card-header { flex-wrap: wrap; gap: 8px; }
  .table-card { overflow-x: auto; }
  .data-table { min-width: 520px; }
}
</style>
