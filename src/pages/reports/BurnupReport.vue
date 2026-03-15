<template>
  <div class="report-wrap">
    <!-- Controls -->
    <div class="report-controls">
      <div class="control-group">
        <label class="control-label">Sprint</label>
        <select v-model="selectedSprint" class="control-select">
          <option v-for="s in sprintOptions" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div class="stat-chips">
        <span class="chip chip-blue">Scope: {{ totalScope }} pts</span>
        <span class="chip chip-green">Completed: {{ completedPts }} pts</span>
      </div>
    </div>

    <!-- Chart -->
    <div class="chart-card">
      <div class="chart-card-header">
        <span class="chart-card-title">Burnup Chart</span>
        <div class="legend">
          <span class="legend-item"><span class="legend-dot" style="background:#4f46e5"></span>Scope</span>
          <span class="legend-item"><span class="legend-dot" style="background:#22c55e"></span>Completed</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`" class="chart-svg">
        <line v-for="y in yGridLines" :key="y" x1="50" :y1="yScale(y)" :x2="chartW-20" :y2="yScale(y)" stroke="#f1f5f9" stroke-width="1.5"/>
        <text v-for="y in yGridLines" :key="'l'+y" x="44" :y="yScale(y)+4" text-anchor="end" font-size="11" fill="#94a3b8">{{ y }}</text>
        <text v-for="(d,i) in days" :key="'x'+i" :x="xScale(i)" :y="chartH-8" text-anchor="middle" font-size="11" fill="#94a3b8">{{ d }}</text>
        <polyline :points="scopePoints" fill="none" stroke="#c7d2fe" stroke-width="2" stroke-dasharray="6 3"/>
        <polygon :points="completedArea" fill="rgba(34,197,94,0.08)"/>
        <polyline :points="completedPoints" fill="none" stroke="#22c55e" stroke-width="2.5"/>
        <circle v-for="(p,i) in completedData" :key="'cd'+i" :cx="xScale(i)" :cy="yScale(p)" r="4" fill="#22c55e" stroke="white" stroke-width="1.5"/>
      </svg>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-value" :style="`color:${s.color}`">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const sprintOptions = computed(() => store.sprints)
const selectedSprint = ref(store.sprints[0]?.id ?? '')

const chartW = 700, chartH = 260
const padL = 55, padR = 20, padT = 20, padB = 30
const maxVal = 100
const days = ['Day 1','Day 3','Day 5','Day 7','Day 9','Day 11','Day 13','Day 14']
const scopeData = [80,82,85,85,90,90,92,95]
const completedData = [0,10,22,35,48,60,75,88]
const totalScope = computed(() => scopeData[scopeData.length-1])
const completedPts = computed(() => completedData[completedData.length-1])
const yGridLines = [0,25,50,75,100]
function xScale(i: number) { return padL + (i/(days.length-1))*(chartW-padL-padR) }
function yScale(v: number) { return padT + (1-v/maxVal)*(chartH-padT-padB) }
const scopePoints = computed(() => scopeData.map((v,i) => `${xScale(i)},${yScale(v)}`).join(' '))
const completedPoints = computed(() => completedData.map((v,i) => `${xScale(i)},${yScale(v)}`).join(' '))
const completedArea = computed(() => {
  const top = completedData.map((v,i) => `${xScale(i)},${yScale(v)}`).join(' ')
  return `${top} ${xScale(days.length-1)},${yScale(0)} ${xScale(0)},${yScale(0)}`
})
const stats = [
  { label: 'Total Scope',   value: '95 pts', color: '#4f46e5' },
  { label: 'Completed',     value: '88 pts', color: '#22c55e' },
  { label: 'Remaining',     value: '7 pts',  color: '#f97316' },
  { label: 'Completion %',  value: '93%',    color: '#8b5cf6' },
]
</script>

<style scoped>
@import '@/styles/dashboard-shared.css';
.report-wrap { display: flex; flex-direction: column; gap: 20px; font-family: 'Inter', sans-serif; }
.report-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.control-group { display: flex; align-items: center; gap: 8px; }
.control-label { font-size: 13px; font-weight: 600; color: #374151; }
.control-select {
  padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #1e293b; background: #fff; outline: none;
  font-family: 'Inter', sans-serif; cursor: pointer; min-width: 200px;
}
.stat-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { padding: 4px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 600; }
.chip-blue  { background: #dbeafe; color: #1d4ed8; }
.chip-green { background: #dcfce7; color: #15803d; }
.chip-red   { background: #fee2e2; color: #dc2626; }
.chip-orange{ background: #fef3c7; color: #d97706; }
.chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
.chart-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.chart-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748b; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.chart-svg { display: block; }
.stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; text-align: center; }
.stat-value { font-size: 22px; font-weight: 800; }
.stat-label { font-size: 12px; color: #94a3b8; margin-top: 4px; }
</style>
