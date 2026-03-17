<template>
  <div class="report-wrap">
    <div class="report-controls">
      <div class="control-group">
        <label class="control-label">Issue Type</label>
        <select v-model="issueType" class="control-select">
          <option v-for="t in ['All','Task','Bug','Story']" :key="t">{{ t }}</option>
        </select>
      </div>
      <div class="stat-chips">
        <span class="chip chip-blue">Avg Cycle Time: {{ avgCycle }} days</span>
        <span class="chip chip-orange">Median: {{ medianCycle }} days</span>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-card-header">
        <span class="chart-card-title">Cycle Time Scatter Plot</span>
        <div class="legend">
          <span class="legend-item"><span class="legend-dot" style="background:#4f46e5"></span>Task</span>
          <span class="legend-item"><span class="legend-dot" style="background:#ef4444"></span>Bug</span>
          <span class="legend-item"><span class="legend-dot" style="background:#22c55e"></span>Story</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`" class="chart-svg">
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#f1f5f9" stroke-width="1.5"/>
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#94a3b8">{{ y }}d</text>
        <text v-for="(d,i) in xLabels" :key="'x'+i" :x="xS(i)" :y="chartH-8" text-anchor="middle" font-size="10" fill="#94a3b8">{{ d }}</text>
        <line x1="50" :y1="yS(avgCycle)" :x2="chartW-20" :y2="yS(avgCycle)" stroke="#f97316" stroke-width="1.5" stroke-dasharray="5 3"/>
        <text :x="chartW-18" :y="yS(avgCycle)-4" text-anchor="end" font-size="10" fill="#f97316">avg</text>
        <circle v-for="(p,i) in filteredPoints" :key="i" :cx="xS(p.x)" :cy="yS(p.y)" r="5" :fill="typeColor(p.type)" fill-opacity="0.8" stroke="white" stroke-width="1"/>
      </svg>
    </div>

    <div class="two-col">
      <div class="table-card">
        <div class="table-title">Cycle Time Distribution</div>
        <div class="dist-list">
          <div v-for="b in buckets" :key="b.label" class="dist-row">
            <div class="dist-meta">
              <span class="dist-label">{{ b.label }}</span>
              <span class="dist-count">{{ b.count }} issues</span>
            </div>
            <div class="progress-track"><div class="progress-fill" :style="`width:${(b.count/totalIssues)*100}%;background:${b.color}`"></div></div>
          </div>
        </div>
      </div>
      <div class="table-card">
        <div class="table-title">By Issue Type</div>
        <table class="data-table">
          <thead><tr><th>Type</th><th>Count</th><th>Avg Days</th><th>Max Days</th></tr></thead>
          <tbody>
            <tr v-for="t in typeStats" :key="t.type">
              <td><span class="type-badge" :style="`background:${t.bg};color:${t.color}`">{{ t.type }}</span></td>
              <td>{{ t.count }}</td>
              <td>{{ t.avg }}</td>
              <td>{{ t.max }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const issueType = ref('All')
const chartW = 700, chartH = 260, padL = 55, padR = 20, padT = 20, padB = 30, maxY = 20
const yGrid = [0,5,10,15,20]
const xLabels = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10']
function xS(i: number) { return padL+(i/(xLabels.length-1))*(chartW-padL-padR) }
function yS(v: number) { return padT+(1-v/maxY)*(chartH-padT-padB) }
const allPoints = [
  {x:0,y:3,type:'Task'},{x:0,y:5,type:'Bug'},{x:1,y:2,type:'Story'},{x:1,y:7,type:'Bug'},
  {x:2,y:4,type:'Task'},{x:2,y:12,type:'Bug'},{x:3,y:3,type:'Story'},{x:3,y:6,type:'Task'},
  {x:4,y:8,type:'Bug'},{x:4,y:2,type:'Task'},{x:5,y:5,type:'Story'},{x:5,y:9,type:'Bug'},
  {x:6,y:4,type:'Task'},{x:6,y:15,type:'Bug'},{x:7,y:3,type:'Story'},{x:7,y:6,type:'Task'},
  {x:8,y:7,type:'Bug'},{x:8,y:4,type:'Story'},{x:9,y:5,type:'Task'},{x:9,y:11,type:'Bug'},
]
const filteredPoints = computed(() => issueType.value==='All' ? allPoints : allPoints.filter(p=>p.type===issueType.value))
function typeColor(t: string) { return t==='Task'?'#4f46e5':t==='Bug'?'#ef4444':'#22c55e' }
const avgCycle = computed(() => { const p=filteredPoints.value; return p.length?Math.round(p.reduce((a,p)=>a+p.y,0)/p.length):0 })
const medianCycle = computed(() => { const s=[...filteredPoints.value].map(p=>p.y).sort((a,b)=>a-b); return s[Math.floor(s.length/2)]??0 })
const totalIssues = allPoints.length
const buckets = [
  { label:'1-3 days',  count:allPoints.filter(p=>p.y<=3).length,              color:'#22c55e' },
  { label:'4-7 days',  count:allPoints.filter(p=>p.y>3&&p.y<=7).length,       color:'#4f46e5' },
  { label:'8-14 days', count:allPoints.filter(p=>p.y>7&&p.y<=14).length,      color:'#f97316' },
  { label:'15+ days',  count:allPoints.filter(p=>p.y>14).length,              color:'#ef4444' },
]
const typeStats = [
  { type:'Task',  color:'#4f46e5', bg:'#ede9fe', count:allPoints.filter(p=>p.type==='Task').length,  avg:4, max:7  },
  { type:'Bug',   color:'#dc2626', bg:'#fee2e2', count:allPoints.filter(p=>p.type==='Bug').length,   avg:9, max:15 },
  { type:'Story', color:'#15803d', bg:'#dcfce7', count:allPoints.filter(p=>p.type==='Story').length, avg:3, max:5  },
]
</script>

<style scoped>
.report-wrap { display: flex; flex-direction: column; gap: 20px; font-family: 'Inter', sans-serif; }
.report-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.control-group { display: flex; align-items: center; gap: 8px; }
.control-label { font-size: 13px; font-weight: 600; color: #374151; }
.control-select { padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1e293b; background: #fff; outline: none; font-family: 'Inter', sans-serif; cursor: pointer; min-width: 160px; }
.stat-chips { display: flex; gap: 8px; }
.chip { padding: 4px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 600; }
.chip-blue   { background: #dbeafe; color: #1d4ed8; }
.chip-orange { background: #fef3c7; color: #d97706; }
.chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
.chart-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.chart-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748b; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.chart-svg { display: block; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.table-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.table-title { font-size: 14px; font-weight: 700; color: #0f172a; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
.dist-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
.dist-row { margin-bottom: 2px; }
.dist-meta { display: flex; justify-content: space-between; margin-bottom: 5px; }
.dist-label { font-size: 13px; color: #374151; }
.dist-count { font-size: 12px; font-weight: 600; color: #64748b; }
.progress-track { height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.progress-fill  { height: 100%; border-radius: 4px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.data-table td { padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #374151; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #f8fafc; }
.type-badge { padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
@media (max-width: 640px) {
  .two-col { grid-template-columns: 1fr; }
  .chart-card-header { flex-wrap: wrap; gap: 8px; }
  .stat-chips { flex-wrap: wrap; }
}
</style>
