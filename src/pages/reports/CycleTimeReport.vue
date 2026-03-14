<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="4">
        <v-select v-model="issueType" :items="['All', 'Task', 'Bug', 'Story']"
          label="Issue Type" variant="outlined" density="compact" hide-details />
      </v-col>
      <v-col cols="auto">
        <v-chip color="blue" variant="tonal" size="small">Avg Cycle Time: {{ avgCycle }} days</v-chip>
      </v-col>
      <v-col cols="auto">
        <v-chip color="orange" variant="tonal" size="small">Median: {{ medianCycle }} days</v-chip>
      </v-col>
    </v-row>

    <!-- Scatter Plot -->
    <v-card flat border class="pa-6 mb-6">
      <div class="d-flex align-center mb-4">
        <h3 class="text-subtitle-1 font-weight-bold">Cycle Time Scatter Plot</h3>
        <v-spacer />
        <div class="d-flex align-center gap-4 text-caption text-medium-emphasis">
          <span class="d-flex align-center gap-1"><span class="legend-dot blue-dot"></span> Task</span>
          <span class="d-flex align-center gap-1"><span class="legend-dot red-dot"></span> Bug</span>
          <span class="d-flex align-center gap-1"><span class="legend-dot green-dot"></span> Story</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`">
        <!-- Grid -->
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#E0E0E0" stroke-width="1" />
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#9E9E9E">{{ y }}d</text>
        <text v-for="(d,i) in xLabels" :key="'x'+i" :x="xS(i)" :y="chartH-8" text-anchor="middle" font-size="10" fill="#9E9E9E">{{ d }}</text>
        <!-- Avg line -->
        <line x1="50" :y1="yS(avgCycle)" :x2="chartW-20" :y2="yS(avgCycle)"
          stroke="#FF7043" stroke-width="1.5" stroke-dasharray="5 3" />
        <text :x="chartW-18" :y="yS(avgCycle)-4" text-anchor="end" font-size="10" fill="#FF7043">avg</text>
        <!-- Dots -->
        <circle v-for="(p, i) in filteredPoints" :key="i"
          :cx="xS(p.x)" :cy="yS(p.y)" r="5"
          :fill="typeColor(p.type)" fill-opacity="0.75" stroke="white" stroke-width="1" />
      </svg>
    </v-card>

    <!-- Distribution -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card flat border class="pa-4">
          <div class="text-subtitle-2 font-weight-bold mb-4">Cycle Time Distribution</div>
          <div v-for="b in buckets" :key="b.label" class="mb-3">
            <div class="d-flex justify-space-between text-caption mb-1">
              <span>{{ b.label }}</span>
              <span class="font-weight-medium">{{ b.count }} issues</span>
            </div>
            <v-progress-linear :model-value="(b.count / totalIssues) * 100" :color="b.color" height="8" rounded />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card flat border class="pa-4">
          <div class="text-subtitle-2 font-weight-bold mb-4">By Issue Type</div>
          <v-table density="compact">
            <thead>
              <tr>
                <th>Type</th>
                <th>Count</th>
                <th>Avg Days</th>
                <th>Max Days</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in typeStats" :key="t.type">
                <td class="py-2">
                  <v-chip size="x-small" :color="t.color" variant="tonal" label>{{ t.type }}</v-chip>
                </td>
                <td>{{ t.count }}</td>
                <td>{{ t.avg }}</td>
                <td>{{ t.max }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const issueType = ref('All')

const chartW = 700, chartH = 260
const padL = 55, padR = 20, padT = 20, padB = 30
const maxY = 20
const yGrid = [0, 5, 10, 15, 20]
const xLabels = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10']

function xS(i: number) { return padL + (i / (xLabels.length - 1)) * (chartW - padL - padR) }
function yS(v: number) { return padT + (1 - v / maxY) * (chartH - padT - padB) }

const allPoints = [
  { x: 0, y: 3, type: 'Task' }, { x: 0, y: 5, type: 'Bug' }, { x: 1, y: 2, type: 'Story' },
  { x: 1, y: 7, type: 'Bug' }, { x: 2, y: 4, type: 'Task' }, { x: 2, y: 12, type: 'Bug' },
  { x: 3, y: 3, type: 'Story' }, { x: 3, y: 6, type: 'Task' }, { x: 4, y: 8, type: 'Bug' },
  { x: 4, y: 2, type: 'Task' }, { x: 5, y: 5, type: 'Story' }, { x: 5, y: 9, type: 'Bug' },
  { x: 6, y: 4, type: 'Task' }, { x: 6, y: 15, type: 'Bug' }, { x: 7, y: 3, type: 'Story' },
  { x: 7, y: 6, type: 'Task' }, { x: 8, y: 7, type: 'Bug' }, { x: 8, y: 4, type: 'Story' },
  { x: 9, y: 5, type: 'Task' }, { x: 9, y: 11, type: 'Bug' },
]

const filteredPoints = computed(() =>
  issueType.value === 'All' ? allPoints : allPoints.filter(p => p.type === issueType.value)
)

function typeColor(type: string) {
  return type === 'Task' ? '#1976D2' : type === 'Bug' ? '#E53935' : '#43A047'
}

const avgCycle = computed(() => {
  const pts = filteredPoints.value
  return pts.length ? Math.round(pts.reduce((a, p) => a + p.y, 0) / pts.length) : 0
})

const medianCycle = computed(() => {
  const sorted = [...filteredPoints.value].map(p => p.y).sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted[mid] ?? 0
})

const totalIssues = allPoints.length

const buckets = [
  { label: '1-3 days', count: allPoints.filter(p => p.y <= 3).length, color: 'green' },
  { label: '4-7 days', count: allPoints.filter(p => p.y > 3 && p.y <= 7).length, color: 'blue' },
  { label: '8-14 days', count: allPoints.filter(p => p.y > 7 && p.y <= 14).length, color: 'orange' },
  { label: '15+ days', count: allPoints.filter(p => p.y > 14).length, color: 'red' },
]

const typeStats = [
  { type: 'Task', color: 'blue', count: allPoints.filter(p => p.type === 'Task').length, avg: 4, max: 7 },
  { type: 'Bug', color: 'red', count: allPoints.filter(p => p.type === 'Bug').length, avg: 9, max: 15 },
  { type: 'Story', color: 'green', count: allPoints.filter(p => p.type === 'Story').length, avg: 3, max: 5 },
]
</script>

<style scoped>
.gap-4 { gap: 16px; }
.gap-1 { gap: 4px; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
.blue-dot { background: #1976D2; }
.red-dot { background: #E53935; }
.green-dot { background: #43A047; }
</style>
