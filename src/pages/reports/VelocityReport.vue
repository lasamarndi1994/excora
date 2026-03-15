<template>
  <div class="report-wrap">
    <div class="report-controls">
      <div class="stat-chips">
        <span class="chip chip-blue">Avg Velocity: {{ avgVelocity }} pts/sprint</span>
        <span class="chip chip-green">Trend: +{{ trend }}%</span>
      </div>
    </div>
    <div class="chart-card">
      <div class="chart-card-header">
        <span class="chart-card-title">Sprint Velocity</span>
        <div class="legend">
          <span class="legend-item"><span class="legend-dot" style="background:#c7d2fe"></span>Committed</span>
          <span class="legend-item"><span class="legend-dot" style="background:#4f46e5"></span>Completed</span>
          <span class="legend-item"><span class="legend-line" style="border-top:2px dashed #f97316"></span>Average</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`" class="chart-svg">
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#f1f5f9" stroke-width="1.5"/>
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#94a3b8">{{ y }}</text>
        <g v-for="(s,i) in sprints" :key="i">
          <rect :x="barX(i,0)" :y="yS(s.committed)" :width="barW" :height="yS(0)-yS(s.committed)" fill="#c7d2fe" rx="4"/>
          <rect :x="barX(i,1)" :y="yS(s.completed)" :width="barW" :height="yS(0)-yS(s.completed)" fill="#4f46e5" rx="4"/>
          <text :x="barX(i,0)+barW" :y="chartH-8" text-anchor="middle" font-size="10" fill="#94a3b8">{{ s.name }}</text>
        </g>
        <line x1="50" :y1="yS(avgVelocity)" :x2="chartW-20" :y2="yS(avgVelocity)" stroke="#f97316" stroke-width="2" stroke-dasharray="6 3"/>
        <text :x="chartW-18" :y="yS(avgVelocity)-5" text-anchor="end" font-size="10" fill="#f97316">avg</text>
      </svg>
    </div>
    <div class="table-card">
      <div class="table-title">Sprint Breakdown</div>
      <table class="data-table">
        <thead><tr><th>Sprint</th><th>Committed</th><th>Completed</th><th>Completion Rate</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="s in sprints" :key="s.name">
            <td class="font-medium">{{ s.name }}</td>
            <td>{{ s.committed }}</td>
            <td>{{ s.completed }}</td>
            <td style="min-width:140px"><div class="progress-track"><div class="progress-fill" :style="`width:${(s.completed/s.committed)*100}%;background:#4f46e5`"></div></div></td>
            <td><span class="status-badge" :class="s.status==='Completed'?'badge-green':s.status==='Active'?'badge-blue':'badge-grey'">{{ s.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
const store = useTaskStore()
const chartW = 700, chartH = 260, padL = 55, padR = 20, padT = 20, padB = 30, maxVal = 120
const yGrid = [0,30,60,90,120]
function yS(v: number) { return padT+(1-v/maxVal)*(chartH-padT-padB) }
const sprints = computed(() => store.sprints.map(s => ({ name: s.name.split(' ')[1]??s.name, committed: s.taskCount*4, completed: Math.round(s.taskCount*4*(s.progress/100)), status: s.status })))
const groupW = computed(() => (chartW-padL-padR)/sprints.value.length)
const barW = computed(() => Math.min(groupW.value*0.35, 28))
function barX(i: number, slot: 0|1) { const c = padL+(i+0.5)*groupW.value; return c-barW.value+slot*(barW.value+2) }
const avgVelocity = computed(() => { const v = sprints.value.map(s=>s.completed); return Math.round(v.reduce((a,b)=>a+b,0)/v.length) })
const trend = computed(() => { const v = sprints.value.map(s=>s.completed); if(v.length<2) return 0; const l=v[v.length-1]??0, p=v[v.length-2]??1; return Math.round(((l-p)/p)*100) })
</script>

<style scoped>
.report-wrap { display: flex; flex-direction: column; gap: 20px; font-family: 'Inter', sans-serif; }
.report-controls { display: flex; align-items: center; gap: 16px; }
.stat-chips { display: flex; gap: 8px; }
.chip { padding: 4px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 600; }
.chip-blue  { background: #dbeafe; color: #1d4ed8; }
.chip-green { background: #dcfce7; color: #15803d; }
.chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
.chart-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.chart-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748b; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-line { display: inline-block; width: 24px; }
.chart-svg { display: block; }
.table-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.table-title { font-size: 14px; font-weight: 700; color: #0f172a; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.data-table td { padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #374151; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #f8fafc; }
.font-medium { font-weight: 600; }
.progress-track { height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.progress-fill  { height: 100%; border-radius: 4px; }
.status-badge { padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
.badge-green { background: #dcfce7; color: #15803d; }
.badge-blue  { background: #dbeafe; color: #1d4ed8; }
.badge-grey  { background: #f1f5f9; color: #64748b; }
</style>
