<template>
  <div class="report-wrap">
    <div class="report-controls">
      <div class="control-group">
        <label class="control-label">Time Range</label>
        <select v-model="range" class="control-select">
          <option v-for="r in ['Last 2 Weeks','Last Month','Last Quarter']" :key="r">{{ r }}</option>
        </select>
      </div>
      <div class="stat-chips">
        <span v-for="s in statusSummary" :key="s.label" class="chip" :class="`chip-${s.color}`">{{ s.label }}: {{ s.count }}</span>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-card-header">
        <span class="chart-card-title">Cumulative Flow Diagram</span>
        <div class="legend">
          <span v-for="s in statusColors" :key="s.label" class="legend-item">
            <span class="legend-dot" :style="`background:${s.stroke}`"></span>{{ s.label }}
          </span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`" class="chart-svg">
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#f1f5f9" stroke-width="1.5"/>
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#94a3b8">{{ y }}</text>
        <text v-for="(d,i) in days" :key="'x'+i" :x="xS(i)" :y="chartH-8" text-anchor="middle" font-size="10" fill="#94a3b8">{{ d }}</text>
        <polygon v-for="layer in stackedLayers" :key="layer.label" :points="layer.points" :fill="layer.fill" :stroke="layer.stroke" stroke-width="1"/>
      </svg>
    </div>

    <div class="bottleneck-grid">
      <div v-for="s in statusColors" :key="s.label" class="bottleneck-card" :style="`border-top:3px solid ${s.stroke}`">
        <div class="bottleneck-value" :style="`color:${s.stroke}`">{{ s.avg }}</div>
        <div class="bottleneck-label">{{ s.label }}</div>
        <div class="bottleneck-sub">avg items/day</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
const store = useTaskStore()
const range = ref('Last 2 Weeks')
const chartW = 700, chartH = 280, padL = 55, padR = 20, padT = 20, padB = 30, maxVal = 30
const yGrid = [0,10,20,30]
const days = ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14']
const todoData =       [8,9,10,9,8,7,6,5,5,4,4,3,3,2]
const inProgressData = [3,3,4,5,5,6,6,7,6,6,5,5,4,4]
const reviewData =     [1,1,2,2,3,3,4,4,5,5,5,6,6,6]
const doneData =       [2,3,3,4,5,6,7,8,9,10,11,12,13,14]
function xS(i: number) { return padL+(i/(days.length-1))*(chartW-padL-padR) }
function yS(v: number) { return padT+(1-v/maxVal)*(chartH-padT-padB) }
function buildArea(bottom: number[], top: number[]) {
  const topPts = top.map((v,i) => `${xS(i)},${yS(v)}`).join(' ')
  const botPts = [...bottom].reverse().map((v,i) => `${xS(days.length-1-i)},${yS(v)}`).join(' ')
  return `${topPts} ${botPts}`
}
const zeros = days.map(()=>0)
const doneTop = doneData
const reviewTop = doneData.map((v,i)=>v+(reviewData[i]??0))
const inProgTop = reviewTop.map((v,i)=>v+(inProgressData[i]??0))
const todoTop = inProgTop.map((v,i)=>v+(todoData[i]??0))
const stackedLayers = computed(() => [
  { label:'Done',        fill:'rgba(34,197,94,0.25)',  stroke:'#22c55e', points:buildArea(zeros,doneTop) },
  { label:'In Review',   fill:'rgba(59,130,246,0.2)',  stroke:'#3b82f6', points:buildArea(doneTop,reviewTop) },
  { label:'In Progress', fill:'rgba(249,115,22,0.2)',  stroke:'#f97316', points:buildArea(reviewTop,inProgTop) },
  { label:'To Do',       fill:'rgba(148,163,184,0.2)', stroke:'#94a3b8', points:buildArea(inProgTop,todoTop) },
])
const statusColors = [
  { label:'To Do',       stroke:'#94a3b8', avg:'5.4' },
  { label:'In Progress', stroke:'#f97316', avg:'5.1' },
  { label:'In Review',   stroke:'#3b82f6', avg:'3.9' },
  { label:'Done',        stroke:'#22c55e', avg:'7.4' },
]
const statusSummary = computed(() => [
  { label:'TODO',        count:store.issues.filter(i=>i.status==='TODO').length,        color:'grey' },
  { label:'In Progress', count:store.issues.filter(i=>i.status==='IN_PROGRESS').length, color:'orange' },
  { label:'Done',        count:store.issues.filter(i=>i.status==='DONE').length,        color:'green' },
])
</script>

<style scoped>
.report-wrap { display: flex; flex-direction: column; gap: 20px; font-family: 'Inter', sans-serif; }
.report-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.control-group { display: flex; align-items: center; gap: 8px; }
.control-label { font-size: 13px; font-weight: 600; color: #374151; }
.control-select { padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1e293b; background: #fff; outline: none; font-family: 'Inter', sans-serif; cursor: pointer; min-width: 180px; }
.stat-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { padding: 4px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 600; }
.chip-grey   { background: #f1f5f9; color: #475569; }
.chip-orange { background: #fef3c7; color: #d97706; }
.chip-green  { background: #dcfce7; color: #15803d; }
.chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
.chart-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.chart-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.legend { display: flex; gap: 12px; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748b; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.chart-svg { display: block; }
.bottleneck-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.bottleneck-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; text-align: center; }
.bottleneck-value { font-size: 24px; font-weight: 800; }
.bottleneck-label { font-size: 13px; font-weight: 600; color: #374151; margin-top: 4px; }
.bottleneck-sub   { font-size: 11.5px; color: #94a3b8; margin-top: 2px; }
</style>
