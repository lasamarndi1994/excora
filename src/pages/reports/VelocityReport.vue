<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col cols="auto">
        <v-chip color="blue" variant="tonal" size="small">Avg Velocity: {{ avgVelocity }} pts/sprint</v-chip>
      </v-col>
      <v-col cols="auto">
        <v-chip color="green" variant="tonal" size="small">Trend: +{{ trend }}%</v-chip>
      </v-col>
    </v-row>

    <!-- Bar Chart -->
    <v-card flat border class="pa-6 mb-6">
      <div class="d-flex align-center mb-4">
        <h3 class="text-subtitle-1 font-weight-bold">Sprint Velocity</h3>
        <v-spacer />
        <div class="d-flex align-center gap-4 text-caption text-medium-emphasis">
          <span class="d-flex align-center gap-1"><span class="legend-dot committed"></span> Committed</span>
          <span class="d-flex align-center gap-1"><span class="legend-dot completed"></span> Completed</span>
          <span class="d-flex align-center gap-1"><span class="legend-line avg"></span> Average</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`">
        <!-- Grid -->
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#E0E0E0" stroke-width="1" />
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#9E9E9E">{{ y }}</text>
        <!-- Bars -->
        <g v-for="(s, i) in sprints" :key="i">
          <!-- Committed bar -->
          <rect :x="barX(i, 0)" :y="yS(s.committed)" :width="barW" :height="yS(0)-yS(s.committed)"
            fill="#90CAF9" rx="3" />
          <!-- Completed bar -->
          <rect :x="barX(i, 1)" :y="yS(s.completed)" :width="barW" :height="yS(0)-yS(s.completed)"
            fill="#1976D2" rx="3" />
          <!-- X label -->
          <text :x="barX(i, 0) + barW" :y="chartH-8" text-anchor="middle" font-size="10" fill="#9E9E9E">{{ s.name }}</text>
        </g>
        <!-- Average line -->
        <line x1="50" :y1="yS(avgVelocity)" :x2="chartW-20" :y2="yS(avgVelocity)"
          stroke="#FF7043" stroke-width="2" stroke-dasharray="6 3" />
        <text :x="chartW-18" :y="yS(avgVelocity)-4" text-anchor="end" font-size="10" fill="#FF7043">avg</text>
      </svg>
    </v-card>

    <!-- Sprint breakdown table -->
    <v-card flat border>
      <v-card-title class="text-subtitle-1 font-weight-bold pa-4">Sprint Breakdown</v-card-title>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Sprint</th>
            <th>Committed</th>
            <th>Completed</th>
            <th>Completion Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in sprints" :key="s.name">
            <td class="py-2 font-weight-medium">{{ s.name }}</td>
            <td>{{ s.committed }}</td>
            <td>{{ s.completed }}</td>
            <td>
              <v-progress-linear :model-value="(s.completed/s.committed)*100" color="blue" height="6" rounded />
            </td>
            <td>
              <v-chip size="x-small" :color="s.status === 'Completed' ? 'green' : s.status === 'Active' ? 'blue' : 'grey'" variant="tonal" label>
                {{ s.status }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()

const chartW = 700, chartH = 260
const padL = 55, padR = 20, padT = 20, padB = 30
const maxVal = 120
const yGrid = [0, 30, 60, 90, 120]

function yS(v: number) { return padT + (1 - v / maxVal) * (chartH - padT - padB) }

const sprints = computed(() =>
  store.sprints.map(s => ({
    name: s.name.split(' ')[1] ?? s.name,
    committed: s.taskCount * 4,
    completed: Math.round(s.taskCount * 4 * (s.progress / 100)),
    status: s.status,
  }))
)

const groupW = computed(() => (chartW - 55 - 20) / sprints.value.length)
const barW = computed(() => Math.min(groupW.value * 0.35, 28))

function barX(i: number, slot: 0 | 1) {
  const center = 55 + (i + 0.5) * groupW.value
  return center - barW.value + slot * (barW.value + 2)
}

const avgVelocity = computed(() => {
  const vals = sprints.value.map(s => s.completed)
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
})

const trend = computed(() => {
  const vals = sprints.value.map(s => s.completed)
  if (vals.length < 2) return 0
  const last = vals[vals.length - 1] ?? 0
  const prev = vals[vals.length - 2] ?? 1
  return Math.round(((last - prev) / prev) * 100)
})
</script>

<style scoped>
.gap-4 { gap: 16px; }
.gap-1 { gap: 4px; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
.committed { background: #90CAF9; }
.completed { background: #1976D2; }
.legend-line { display: inline-block; width: 20px; height: 3px; border-radius: 2px; margin-right: 4px; vertical-align: middle; }
.avg { background: #FF7043; }
</style>
