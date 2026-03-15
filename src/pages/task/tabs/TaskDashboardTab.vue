<template>
  <div class="tdash-root">

    <!-- Stat cards -->
    <div class="stat-row">
      <div v-for="(s, i) in stats" :key="s.label" class="stat-card" :style="{ animationDelay: i * 60 + 'ms' }">
        <div class="sc-icon" :style="{ background: s.iconBg }">
          <v-icon size="18" :color="s.iconColor">{{ s.icon }}</v-icon>
        </div>
        <div class="sc-val">{{ s.value }}</div>
        <div class="sc-label">{{ s.label }}</div>
        <div class="sc-bar"><div class="sc-bar-fill" :style="{ width: s.pct + '%', background: s.iconColor }"></div></div>
      </div>
    </div>

    <!-- Charts row 1 -->
    <div class="charts-row">
      <!-- Bar: tasks by section -->
      <div class="chart-card">
        <div class="cc-head">
          <span class="cc-title">Tasks by section</span>
          <span class="cc-filter"><v-icon size="12">mdi-filter-outline</v-icon> 1 Filter</span>
        </div>
        <div class="bar-chart">
          <div v-for="bar in sectionBars" :key="bar.label" class="bar-item">
            <span class="bar-val">{{ bar.count || '' }}</span>
            <div class="bar-col-wrap">
              <div class="bar-fill"
                :style="{ height: bar.count ? (bar.count / maxSection * 100) + '%' : '3px',
                          background: bar.count ? '#818cf8' : '#e2e8f0' }">
              </div>
            </div>
            <span class="bar-lbl">{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <!-- Donut: completion status -->
      <div class="chart-card">
        <div class="cc-head">
          <span class="cc-title">Completion status</span>
          <span class="cc-filter"><v-icon size="12">mdi-filter-outline</v-icon> 2 Filters</span>
        </div>
        <div class="donut-wrap">
          <div class="donut-svg-wrap">
            <svg viewBox="0 0 36 36" width="120" height="120">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" stroke-width="5"/>
              <circle cx="18" cy="18" r="14" fill="none" stroke="#818cf8" stroke-width="5"
                :stroke-dasharray="`${completionPct} ${100 - completionPct}`"
                stroke-dashoffset="25" stroke-linecap="round"/>
            </svg>
            <div class="donut-center">{{ completionTotal }}</div>
          </div>
          <div class="donut-legend">
            <div v-for="seg in completionSegs" :key="seg.label" class="dl-row">
              <span class="dl-dot" :style="{ background: seg.color }"></span>
              <span class="dl-lbl">{{ seg.label }}</span>
              <span class="dl-val">{{ seg.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bar: tasks by project -->
      <div class="chart-card">
        <div class="cc-head">
          <span class="cc-title">Tasks by project</span>
          <span class="cc-filter"><v-icon size="12">mdi-filter-outline</v-icon> No Filters</span>
        </div>
        <div class="bar-chart">
          <div v-for="bar in projectBars" :key="bar.label" class="bar-item">
            <span class="bar-val">{{ bar.count }}</span>
            <div class="bar-col-wrap">
              <div class="bar-fill"
                :style="{ height: (bar.count / maxProject * 100) + '%',
                          background: 'linear-gradient(180deg,#6366f1,#a5b4fc)' }">
              </div>
            </div>
            <span class="bar-lbl">{{ bar.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Line chart: completion over time -->
    <div class="chart-card chart-card--wide">
      <div class="cc-head">
        <span class="cc-title">Task completion over time</span>
        <span class="cc-filter"><v-icon size="12">mdi-filter-outline</v-icon> 1 Filter</span>
      </div>
      <svg class="line-svg" viewBox="0 0 600 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#818cf8" stop-opacity=".25"/>
            <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path :d="areaPath" fill="url(#areaGrad)"/>
        <path :d="linePath" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle v-for="(pt, i) in chartPts" :key="i" :cx="pt.x" :cy="pt.y" r="4" fill="#818cf8" stroke="white" stroke-width="1.5"/>
      </svg>
      <div class="line-labels">
        <span v-for="pt in chartPts" :key="pt.label">{{ pt.label }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const stats = [
  { label: 'Completed',  value: 7,  pct: 64,  icon: 'mdi-check-circle-outline', iconBg: '#f0fdf4', iconColor: '#10b981' },
  { label: 'Incomplete', value: 4,  pct: 36,  icon: 'mdi-circle-half-full',     iconBg: '#eff6ff', iconColor: '#3b82f6' },
  { label: 'Overdue',    value: 3,  pct: 27,  icon: 'mdi-clock-alert-outline',  iconBg: '#fef2f2', iconColor: '#ef4444' },
  { label: 'Total',      value: 11, pct: 100, icon: 'mdi-format-list-checks',   iconBg: '#eef2ff', iconColor: '#6366f1' },
]

const sectionBars = [
  { label: 'Recent', count: 10 }, { label: 'Today', count: 0 },
  { label: 'Next Wk', count: 0 }, { label: 'Later', count: 0 },
]
const maxSection = Math.max(...sectionBars.map(b => b.count), 1)

const projectBars = [
  { label: 'EX Board', count: 7 }, { label: 'Mobile', count: 3 }, { label: 'Analytics', count: 1 },
]
const maxProject = Math.max(...projectBars.map(b => b.count), 1)

const completionSegs = [
  { label: 'Completed',  value: 7, color: '#818cf8' },
  { label: 'Incomplete', value: 4, color: '#e2e8f0' },
]
const completionTotal = completionSegs.reduce((s, c) => s + c.value, 0)
const completionPct   = completionTotal ? (completionSegs[0]!.value / completionTotal) * 100 : 0

const rawPts = [
  { label: 'Mar 8', v: 3 }, { label: 'Mar 10', v: 5 }, { label: 'Mar 12', v: 2 },
  { label: 'Mar 14', v: 7 }, { label: 'Mar 16', v: 4 }, { label: 'Mar 18', v: 6 }, { label: 'Mar 20', v: 3 },
]
const maxV = Math.max(...rawPts.map(p => p.v), 1)
const W = 600, H = 100

const chartPts = computed(() =>
  rawPts.map((p, i, arr) => ({
    label: p.label,
    x: Math.round((i / (arr.length - 1)) * (W - 20) + 10),
    y: Math.round(H - (p.v / (maxV + 1)) * (H - 10) - 5),
  }))
)
const linePath = computed(() => chartPts.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' '))
const areaPath = computed(() => {
  const pts = chartPts.value
  return linePath.value + ` L${pts[pts.length - 1]!.x},${H} L${pts[0]!.x},${H} Z`
})
</script>

<style scoped>
.tdash-root {
  flex: 1; overflow-y: auto; padding: 16px 24px;
  display: flex; flex-direction: column; gap: 16px;
  font-family: 'Inter', sans-serif;
}

/* Stat row */
.stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-card {
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
  padding: 16px; display: flex; flex-direction: column; gap: 6px;
  animation: fadeUp .25s ease both;
  transition: box-shadow .15s, transform .15s;
}
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.07); transform: translateY(-2px); }
.sc-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.sc-val { font-size: 28px; font-weight: 700; color: #0f172a; line-height: 1; }
.sc-label { font-size: 12px; color: #64748b; }
.sc-bar { height: 4px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-top: 4px; }
.sc-bar-fill { height: 100%; border-radius: 99px; transition: width .6s; }

/* Charts row */
.charts-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.chart-card {
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 16px;
}
.chart-card--wide { grid-column: 1 / -1; }
.cc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.cc-title { font-size: 13px; font-weight: 600; color: #0f172a; }
.cc-filter { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #94a3b8; }

/* Bar chart */
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
.bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 4px; height: 100%; }
.bar-val { font-size: 11px; color: #64748b; font-weight: 600; min-height: 16px; }
.bar-col-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.bar-fill { width: 100%; border-radius: 4px 4px 0 0; min-height: 3px; transition: height .5s; }
.bar-lbl { font-size: 10px; color: #94a3b8; text-align: center; }

/* Donut */
.donut-wrap { display: flex; align-items: center; gap: 16px; }
.donut-svg-wrap { position: relative; flex-shrink: 0; }
.donut-center {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700; color: #0f172a;
}
.donut-legend { display: flex; flex-direction: column; gap: 8px; }
.dl-row { display: flex; align-items: center; gap: 7px; font-size: 12px; }
.dl-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.dl-lbl { color: #64748b; flex: 1; }
.dl-val { font-weight: 700; color: #0f172a; }

/* Line chart */
.line-svg { width: 100%; height: 100px; display: block; }
.line-labels { display: flex; justify-content: space-between; margin-top: 6px; }
.line-labels span { font-size: 9px; color: #94a3b8; flex: 1; text-align: center; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
</style>
