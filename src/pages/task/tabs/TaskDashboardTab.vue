<template>
  <div class="overflow-y-auto h-100">
    <div class="pa-4">

      <!-- Top bar -->
      <div class="d-flex align-center justify-space-between mb-4">
        <v-btn size="small" variant="outlined" prepend-icon="mdi-plus"
          class="text-none font-weight-medium text-medium-emphasis" color="medium-emphasis">
          Add widget
        </v-btn>
        <v-btn size="small" variant="text" class="text-none text-medium-emphasis">
          Send feedback
        </v-btn>
      </div>

      <!-- Stat cards -->
      <v-row class="mb-4" dense>
        <v-col v-for="stat in statCards" :key="stat.label" cols="6" md="3">
          <v-card class="stat-card pa-5 d-flex flex-column align-center text-center" border elevation="0">
            <div class="text-body-2 text-medium-emphasis mb-3">{{ stat.label }}</div>
            <div class="stat-number font-weight-light mb-3">{{ stat.value }}</div>
            <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
              <v-icon size="13">mdi-filter-outline</v-icon>
              {{ stat.filter }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts row 1 -->
      <v-row class="mb-4" dense>
        <!-- Total tasks by section -->
        <v-col cols="12" md="6">
          <v-card border elevation="0" class="pa-4">
            <div class="text-body-2 font-weight-medium mb-4">Total tasks by section</div>
            <div class="chart-area d-flex align-end gap-3 px-2 pb-2" style="height:160px">
              <div v-for="bar in sectionBars" :key="bar.label"
                class="d-flex flex-column align-center flex-grow-1 gap-1">
                <span class="text-caption text-medium-emphasis">{{ bar.count || '' }}</span>
                <div class="bar-col rounded-t"
                  :style="{
                    height: bar.count ? (bar.count / maxSectionCount * 120) + 'px' : '3px',
                    background: bar.count ? '#a5b4fc' : '#e2e8f0',
                    width: '100%'
                  }"></div>
                <span class="text-caption text-medium-emphasis text-truncate" style="max-width:56px;font-size:10px">
                  {{ bar.label }}
                </span>
              </div>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                <v-icon size="13">mdi-filter-outline</v-icon> 1 Filter
              </div>
              <v-btn size="x-small" variant="text" class="text-none text-medium-emphasis">See all</v-btn>
            </div>
          </v-card>
        </v-col>

        <!-- Tasks by completion status (donut) -->
        <v-col cols="12" md="6">
          <v-card border elevation="0" class="pa-4">
            <div class="text-body-2 font-weight-medium mb-4">Tasks by completion status this upcoming month</div>
            <div class="d-flex align-center justify-center" style="height:160px">
              <div style="position:relative;width:130px;height:130px;flex-shrink:0">
                <svg viewBox="0 0 36 36" width="130" height="130">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" stroke-width="5" />
                  <circle v-if="completionTotal > 0" cx="18" cy="18" r="14" fill="none"
                    stroke="#a5b4fc" stroke-width="5"
                    :stroke-dasharray="`${completionPct} ${100 - completionPct}`"
                    stroke-dashoffset="25" stroke-linecap="round" />
                </svg>
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
                  <span class="text-h6 font-weight-light text-medium-emphasis">{{ completionTotal }}</span>
                </div>
              </div>
              <div class="ml-6 d-flex flex-column gap-2">
                <div v-for="seg in completionSegments" :key="seg.label" class="d-flex align-center gap-2">
                  <div class="rounded-sm" :style="{ width:'10px', height:'10px', background: seg.color }"></div>
                  <span class="text-caption text-medium-emphasis">{{ seg.label }}</span>
                  <span class="text-caption font-weight-bold ml-auto pl-4">{{ seg.value }}</span>
                </div>
              </div>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                <v-icon size="13">mdi-filter-outline</v-icon> 2 Filters
              </div>
              <v-btn size="x-small" variant="text" class="text-none text-medium-emphasis">See all</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charts row 2 -->
      <v-row dense>
        <!-- Total tasks by project -->
        <v-col cols="12" md="6">
          <v-card border elevation="0" class="pa-4">
            <div class="text-body-2 font-weight-medium mb-3">Total tasks by project</div>
            <div class="d-flex" style="height:160px">
              <!-- Y-axis -->
              <div class="d-flex flex-column justify-space-between text-right pr-2 pb-5 flex-shrink-0" style="width:28px">
                <span style="font-size:9px" class="text-disabled">{{ maxProjectCount }}</span>
                <span style="font-size:9px" class="text-disabled">{{ Math.round(maxProjectCount / 2) }}</span>
                <span style="font-size:9px" class="text-disabled">0</span>
              </div>
              <!-- Bars -->
              <div class="flex-grow-1 d-flex flex-column">
                <div class="flex-grow-1 d-flex align-end gap-3 px-1"
                  style="border-left:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0;">
                  <div v-for="bar in projectBars" :key="bar.label"
                    class="d-flex flex-column align-center flex-grow-1 gap-1">
                    <span style="font-size:10px" class="text-medium-emphasis font-weight-medium">{{ bar.count }}</span>
                    <div class="rounded-t w-100"
                      :style="{
                        height: bar.count ? (bar.count / maxProjectCount * 100) + '%' : '3px',
                        background: 'linear-gradient(180deg,#818cf8,#a5b4fc)',
                        minHeight: bar.count ? '8px' : '3px'
                      }"></div>
                  </div>
                </div>
                <div class="d-flex gap-3 px-1 mt-1">
                  <div v-for="bar in projectBars" :key="bar.label"
                    class="flex-grow-1 text-center text-truncate"
                    style="font-size:10px; color:#94a3b8; max-width:80px">
                    {{ bar.label }}
                  </div>
                </div>
              </div>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                <v-icon size="13">mdi-filter-outline</v-icon> No Filters
              </div>
              <v-btn size="x-small" variant="text" class="text-none text-medium-emphasis">See all</v-btn>
            </div>
          </v-card>
        </v-col>

        <!-- Task completion over time -->
        <v-col cols="12" md="6">
          <v-card border elevation="0" class="pa-4">
            <div class="text-body-2 font-weight-medium mb-3">Task completion over time</div>
            <div class="d-flex" style="height:160px">
              <!-- Y-axis -->
              <div class="d-flex flex-column justify-space-between text-right pr-2 pb-5 flex-shrink-0" style="width:20px">
                <span style="font-size:9px" class="text-disabled">{{ maxV }}</span>
                <span style="font-size:9px" class="text-disabled">{{ Math.round(maxV / 2) }}</span>
                <span style="font-size:9px" class="text-disabled">0</span>
              </div>
              <!-- SVG chart -->
              <div class="flex-grow-1 d-flex flex-column min-width-0">
                <div class="flex-grow-1 position-relative"
                  style="border-left:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; overflow:hidden">
                  <svg width="100%" height="100%" preserveAspectRatio="none"
                    :viewBox="`0 0 ${svgW} ${svgH}`">
                    <line x1="0" :y1="svgH*0.25" :x2="svgW" :y2="svgH*0.25" stroke="#f1f5f9" stroke-width="1"/>
                    <line x1="0" :y1="svgH*0.5"  :x2="svgW" :y2="svgH*0.5"  stroke="#f1f5f9" stroke-width="1"/>
                    <line x1="0" :y1="svgH*0.75" :x2="svgW" :y2="svgH*0.75" stroke="#f1f5f9" stroke-width="1"/>
                    <path :d="areaPath" fill="rgba(129,140,248,0.15)"/>
                    <path :d="linePath" fill="none" stroke="#818cf8"
                      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle v-for="(pt, i) in chartPoints" :key="i"
                      :cx="pt.x" :cy="pt.y" r="3.5" fill="#818cf8" stroke="white" stroke-width="1.5"/>
                  </svg>
                </div>
                <div class="d-flex justify-space-between mt-1">
                  <span v-for="pt in chartPoints" :key="pt.label"
                    style="font-size:9px; color:#94a3b8; flex:1; text-align:center">
                    {{ pt.label }}
                  </span>
                </div>
              </div>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                <v-icon size="13">mdi-filter-outline</v-icon> 1 Filter
              </div>
              <v-btn size="x-small" variant="text" class="text-none text-medium-emphasis">See all</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const statCards = [
  { label: 'Total completed tasks', value: 7,  filter: '1 Filter' },
  { label: 'Total incomplete tasks', value: 4,  filter: '1 Filter' },
  { label: 'Total overdue tasks',    value: 3,  filter: '1 Filter' },
  { label: 'Total tasks',            value: 11, filter: 'No Filters' },
]

const sectionBars = [
  { label: 'Untitled S.', count: 0 },
  { label: 'Untitled S.', count: 0 },
  { label: 'Recently...',  count: 10 },
  { label: 'Do today',    count: 0 },
  { label: 'Do next...',  count: 0 },
  { label: 'Do later',    count: 0 },
]
const maxSectionCount = Math.max(...sectionBars.map(b => b.count), 1)

const projectBars = [
  { label: 'EX Board',   count: 7 },
  { label: 'Mobile App', count: 3 },
  { label: 'Analytics',  count: 1 },
]
const maxProjectCount = Math.max(...projectBars.map(b => b.count), 1)

const completionSegments = [
  { label: 'Completed',  value: 7, color: '#a5b4fc' },
  { label: 'Incomplete', value: 4, color: '#e2e8f0' },
]
const completionTotal = completionSegments.reduce((s, c) => s + c.value, 0)
const completionPct   = completionTotal ? (completionSegments[0]!.value / completionTotal) * 100 : 0

// SVG line chart
const svgW = 300
const svgH = 100

const rawPoints = [
  { label: 'Mar 8',  v: 3 },
  { label: 'Mar 10', v: 5 },
  { label: 'Mar 12', v: 2 },
  { label: 'Mar 14', v: 7 },
  { label: 'Mar 16', v: 4 },
  { label: 'Mar 18', v: 6 },
  { label: 'Mar 20', v: 3 },
]

const maxV = Math.max(...rawPoints.map(p => p.v), 1)

const chartPoints = computed(() =>
  rawPoints.map((pt, i, arr) => ({
    label: pt.label,
    v: pt.v,
    x: Math.round((i / (arr.length - 1)) * (svgW - 10) + 5),
    y: Math.round(svgH - (pt.v / (maxV + 1)) * (svgH - 8) - 4),
  }))
)

const linePath = computed(() =>
  chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
)

const areaPath = computed(() => {
  const pts = chartPoints.value
  return linePath.value +
    ` L${pts[pts.length - 1]!.x},${svgH} L${pts[0]!.x},${svgH} Z`
})
</script>

<style scoped>
.stat-card {
  border-radius: 12px !important;
  transition: box-shadow 0.15s;
}
.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
}
.stat-number {
  font-size: 2.4rem;
  line-height: 1;
  color: rgba(var(--v-theme-on-surface), 0.85);
}
.bar-col {
  min-height: 3px;
  transition: height 0.3s ease;
}
.chart-area {
  border-left: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
</style>
