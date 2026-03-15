<template>
  <div class="report-wrap">
    <div class="report-controls">
      <div class="control-group">
        <label class="control-label">Sprint</label>
        <select v-model="selectedSprint" class="control-select">
          <option v-for="s in sprintOptions" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div class="stat-chips">
        <span class="chip chip-blue">Ideal remaining: {{ idealRemaining }} pts</span>
        <span class="chip chip-red">Actual remaining: {{ actualRemaining }} pts</span>
      </div>
    </div>

    <div class="chart-card">
      <div class="chart-card-header">
        <span class="chart-card-title">Sprint Burndown</span>
        <div class="legend">
          <span class="legend-item"><span class="legend-line" style="border-top:2px dashed #4f46e5"></span>Ideal</span>
          <span class="legend-item"><span class="legend-line" style="border-top:2px solid #ef4444"></span>Actual</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`" class="chart-svg">
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#f1f5f9" stroke-width="1.5"/>
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#94a3b8">{{ y }}</text>
        <text v-for="(d,i) in days" :key="'x'+i" :x="xS(i)" :y="chartH-8" text-anchor="middle" font-size="11" fill="#94a3b8">{{ d }}</text>
        <polyline :points="idealPts" fill="none" stroke="#c7d2fe" stroke-width="2" stroke-dasharray="6 3"/>
        <polygon :points="actualArea" fill="rgba(239,68,68,0.07)"/>
        <polyline :points="actualPts" fill="none" stroke="#ef4444" stroke-width="2.5"/>
        <circle v-for="(v,i) in actual" :key="i" :cx="xS(i)" :cy="yS(v)" r="4" fill="#ef4444" stroke="white" stroke-width="1.5"/>
      </svg>
    </div>

    <!-- Team table -->
    <div class="table-card">
      <div class="table-title">Team Performance</div>
      <table class="data-table">
        <thead><tr><th>Member</th><th>Assigned</th><th>Completed</th><th>Remaining</th><th>Progress</th></tr></thead>
        <tbody>
          <tr v-for="m in members" :key="m.name">
            <td>
              <div class="member-cell">
                <img :src="m.avatar" class="member-avatar" />
                {{ m.name }}
              </div>
            </td>
            <td>{{ m.assigned }}</td>
            <td>{{ m.completed }}</td>
            <td>{{ m.assigned - m.completed }}</td>
            <td style="min-width:140px">
              <div class="progress-track"><div class="progress-fill" :style="`width:${(m.completed/m.assigned)*100}%;background:#22c55e`"></div></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
const store = useTaskStore()
const sprintOptions = computed(() => store.sprints)
const selectedSprint = ref(store.sprints[0]?.id ?? '')
const chartW = 700, chartH = 260, padL = 55, padR = 20, padT = 20, padB = 30, maxVal = 100
const days = ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7','Day 8','Day 9','Day 10']
const ideal = [100,89,78,67,56,45,34,23,12,0]
const actual = [100,95,80,72,65,55,50,40,28,12]
const idealRemaining = computed(() => ideal[ideal.length-1])
const actualRemaining = computed(() => actual[actual.length-1])
const yGrid = [0,25,50,75,100]
function xS(i: number) { return padL+(i/(days.length-1))*(chartW-padL-padR) }
function yS(v: number) { return padT+(1-v/maxVal)*(chartH-padT-padB) }
const idealPts = computed(() => ideal.map((v,i) => `${xS(i)},${yS(v)}`).join(' '))
const actualPts = computed(() => actual.map((v,i) => `${xS(i)},${yS(v)}`).join(' '))
const actualArea = computed(() => { const top = actual.map((v,i) => `${xS(i)},${yS(v)}`).join(' '); return `${top} ${xS(days.length-1)},${yS(0)} ${xS(0)},${yS(0)}` })
const members = computed(() => store.users.map((u,idx) => ({ name: u.name, avatar: u.avatar, assigned: [20,25,18,15][idx]??10, completed: [18,20,12,10][idx]??8 })))
</script>

<style scoped>
.report-wrap { display: flex; flex-direction: column; gap: 20px; font-family: 'Inter', sans-serif; }
.report-controls { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.control-group { display: flex; align-items: center; gap: 8px; }
.control-label { font-size: 13px; font-weight: 600; color: #374151; }
.control-select { padding: 7px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1e293b; background: #fff; outline: none; font-family: 'Inter', sans-serif; cursor: pointer; min-width: 200px; }
.stat-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { padding: 4px 12px; border-radius: 20px; font-size: 12.5px; font-weight: 600; }
.chip-blue { background: #dbeafe; color: #1d4ed8; }
.chip-red  { background: #fee2e2; color: #dc2626; }
.chart-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
.chart-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.chart-card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748b; }
.legend-line { display: inline-block; width: 24px; }
.chart-svg { display: block; }
.table-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.table-title { font-size: 14px; font-weight: 700; color: #0f172a; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #64748b; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.data-table td { padding: 10px 16px; border-bottom: 1px solid #f1f5f9; color: #374151; }
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #f8fafc; }
.member-cell { display: flex; align-items: center; gap: 8px; }
.member-avatar { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; }
.progress-track { height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.progress-fill  { height: 100%; border-radius: 4px; }
</style>
