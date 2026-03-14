<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="4">
        <v-select v-model="range" :items="['Last 2 Weeks', 'Last Month', 'Last Quarter']"
          label="Time Range" variant="outlined" density="compact" hide-details />
      </v-col>
      <v-col cols="auto" v-for="s in statusSummary" :key="s.label">
        <v-chip :color="s.color" variant="tonal" size="small">{{ s.label }}: {{ s.count }}</v-chip>
      </v-col>
    </v-row>

    <!-- Stacked Area Chart -->
    <v-card flat border class="pa-6 mb-6">
      <div class="d-flex align-center mb-4">
        <h3 class="text-subtitle-1 font-weight-bold">Cumulative Flow Diagram</h3>
        <v-spacer />
        <div class="d-flex align-center flex-wrap gap-3 text-caption text-medium-emphasis">
          <span v-for="s in statusColors" :key="s.label" class="d-flex align-center gap-1">
            <span class="legend-dot" :style="{ background: s.fill }"></span>{{ s.label }}
          </span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`">
        <!-- Grid -->
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#E0E0E0" stroke-width="1" />
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#9E9E9E">{{ y }}</text>
        <text v-for="(d,i) in days" :key="'x'+i" :x="xS(i)" :y="chartH-8" text-anchor="middle" font-size="10" fill="#9E9E9E">{{ d }}</text>
        <!-- Stacked areas (bottom to top) -->
        <polygon v-for="layer in stackedLayers" :key="layer.label"
          :points="layer.points" :fill="layer.fill" :stroke="layer.stroke" stroke-width="1" />
      </svg>
    </v-card>

    <!-- Bottleneck Analysis -->
    <v-card flat border>
      <v-card-title class="text-subtitle-1 font-weight-bold pa-4">Bottleneck Analysis</v-card-title>
      <v-row class="pa-4" no-gutters>
        <v-col v-for="s in statusColors" :key="s.label" cols="6" sm="3" class="pa-2">
          <v-card flat :color="s.bg" class="pa-4 text-center rounded-lg">
            <div class="text-h5 font-weight-bold" :style="{ color: s.stroke }">{{ s.avg }}</div>
            <div class="text-caption text-medium-emphasis mt-1">{{ s.label }}</div>
            <div class="text-caption font-weight-medium mt-1" :style="{ color: s.stroke }">avg items/day</div>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const range = ref('Last 2 Weeks')

const chartW = 700, chartH = 280
const padL = 55, padR = 20, padT = 20, padB = 30
const maxVal = 30
const yGrid = [0, 10, 20, 30]

const days = ['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10','D11','D12','D13','D14']

// Raw data per status per day
const todoData =       [8, 9, 10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2]
const inProgressData = [3, 3, 4,  5, 5, 6, 6, 7, 6, 6, 5, 5, 4, 4]
const reviewData =     [1, 1, 2,  2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6]
const doneData =       [2, 3, 3,  4, 5, 6, 7, 8, 9, 10,11,12,13,14]

function xS(i: number) { return padL + (i / (days.length - 1)) * (chartW - padL - padR) }
function yS(v: number) { return padT + (1 - v / maxVal) * (chartH - padT - padB) }

function buildArea(bottom: number[], top: number[]) {
  const topPts = top.map((v, i) => `${xS(i)},${yS(v)}`).join(' ')
  const botPts = [...bottom].reverse().map((v, i) => `${xS(days.length - 1 - i)},${yS(v)}`).join(' ')
  return `${topPts} ${botPts}`
}

const zeros = days.map(() => 0)
const doneTop = doneData
const reviewTop = doneData.map((v, i) => v + (reviewData[i] ?? 0))
const inProgTop = reviewTop.map((v, i) => v + (inProgressData[i] ?? 0))
const todoTop = inProgTop.map((v, i) => v + (todoData[i] ?? 0))

const stackedLayers = computed(() => [
  { label: 'Done', fill: 'rgba(76,175,80,0.35)', stroke: '#43A047', points: buildArea(zeros, doneTop) },
  { label: 'In Review', fill: 'rgba(33,150,243,0.3)', stroke: '#1976D2', points: buildArea(doneTop, reviewTop) },
  { label: 'In Progress', fill: 'rgba(255,152,0,0.3)', stroke: '#F57C00', points: buildArea(reviewTop, inProgTop) },
  { label: 'To Do', fill: 'rgba(158,158,158,0.25)', stroke: '#757575', points: buildArea(inProgTop, todoTop) },
])

const statusColors = [
  { label: 'To Do', fill: 'rgba(158,158,158,0.4)', stroke: '#757575', bg: 'grey-lighten-4', avg: '5.4' },
  { label: 'In Progress', fill: 'rgba(255,152,0,0.4)', stroke: '#F57C00', bg: 'orange-lighten-5', avg: '5.1' },
  { label: 'In Review', fill: 'rgba(33,150,243,0.4)', stroke: '#1976D2', bg: 'blue-lighten-5', avg: '3.9' },
  { label: 'Done', fill: 'rgba(76,175,80,0.4)', stroke: '#43A047', bg: 'green-lighten-5', avg: '7.4' },
]

const statusSummary = computed(() => [
  { label: 'TODO', count: store.issues.filter(i => i.status === 'TODO').length, color: 'grey' },
  { label: 'In Progress', count: store.issues.filter(i => i.status === 'IN_PROGRESS').length, color: 'orange' },
  { label: 'Done', count: store.issues.filter(i => i.status === 'DONE').length, color: 'green' },
])
</script>

<style scoped>
.gap-3 { gap: 12px; }
.gap-1 { gap: 4px; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
</style>
