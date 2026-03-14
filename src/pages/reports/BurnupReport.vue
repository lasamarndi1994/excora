<template>
  <div>
    <!-- Sprint Selector -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="4">
        <v-select v-model="selectedSprint" :items="sprintOptions" item-title="name" item-value="id"
          label="Sprint" variant="outlined" density="compact" hide-details />
      </v-col>
      <v-col cols="auto">
        <v-chip color="blue" variant="tonal" size="small">Scope: {{ totalScope }} pts</v-chip>
      </v-col>
      <v-col cols="auto">
        <v-chip color="green" variant="tonal" size="small">Completed: {{ completedPts }} pts</v-chip>
      </v-col>
    </v-row>

    <!-- Chart Card -->
    <v-card flat border class="pa-6 mb-6">
      <div class="d-flex align-center mb-4">
        <h3 class="text-subtitle-1 font-weight-bold">Burnup Chart</h3>
        <v-spacer />
        <div class="d-flex align-center gap-4 text-caption text-medium-emphasis">
          <span class="d-flex align-center gap-1"><span class="legend-dot bg-blue"></span> Scope</span>
          <span class="d-flex align-center gap-1"><span class="legend-dot bg-green"></span> Completed</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`" class="burnup-svg">
        <!-- Grid lines -->
        <line v-for="y in yGridLines" :key="y" x1="50" :y1="yScale(y)" :x2="chartW - 20" :y2="yScale(y)"
          stroke="#E0E0E0" stroke-width="1" />
        <!-- Y labels -->
        <text v-for="y in yGridLines" :key="'l'+y" x="44" :y="yScale(y) + 4" text-anchor="end"
          font-size="11" fill="#9E9E9E">{{ y }}</text>
        <!-- X labels -->
        <text v-for="(d, i) in days" :key="'x'+i" :x="xScale(i)" :y="chartH - 8" text-anchor="middle"
          font-size="11" fill="#9E9E9E">{{ d }}</text>
        <!-- Scope line -->
        <polyline :points="scopePoints" fill="none" stroke="#1976D2" stroke-width="2.5" stroke-dasharray="6 3" />
        <!-- Completed area -->
        <polygon :points="completedArea" fill="rgba(76,175,80,0.12)" />
        <polyline :points="completedPoints" fill="none" stroke="#43A047" stroke-width="2.5" />
        <!-- Dots -->
        <circle v-for="(p, i) in completedData" :key="'cd'+i" :cx="xScale(i)" :cy="yScale(p)" r="4"
          fill="#43A047" stroke="white" stroke-width="1.5" />
      </svg>
    </v-card>

    <!-- Summary Stats -->
    <v-row>
      <v-col v-for="s in stats" :key="s.label" cols="6" sm="3">
        <v-card flat border class="pa-4 text-center">
          <div class="text-h5 font-weight-bold" :class="s.color">{{ s.value }}</div>
          <div class="text-caption text-medium-emphasis mt-1">{{ s.label }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const sprintOptions = computed(() => store.sprints)
const selectedSprint = ref(store.sprints[0]?.id ?? '')

const chartW = 700
const chartH = 260
const padL = 55, padR = 20, padT = 20, padB = 30
const maxVal = 100

const days = ['Day 1','Day 3','Day 5','Day 7','Day 9','Day 11','Day 13','Day 14']
const scopeData = [80, 82, 85, 85, 90, 90, 92, 95]
const completedData = [0, 10, 22, 35, 48, 60, 75, 88]

const totalScope = computed(() => scopeData[scopeData.length - 1])
const completedPts = computed(() => completedData[completedData.length - 1])

const yGridLines = [0, 25, 50, 75, 100]

function xScale(i: number) {
  return padL + (i / (days.length - 1)) * (chartW - padL - padR)
}
function yScale(v: number) {
  return padT + (1 - v / maxVal) * (chartH - padT - padB)
}

const scopePoints = computed(() =>
  scopeData.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ')
)
const completedPoints = computed(() =>
  completedData.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ')
)
const completedArea = computed(() => {
  const top = completedData.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ')
  const base = `${xScale(days.length - 1)},${yScale(0)} ${xScale(0)},${yScale(0)}`
  return `${top} ${base}`
})

const stats = [
  { label: 'Total Scope', value: '95 pts', color: 'text-blue' },
  { label: 'Completed', value: '88 pts', color: 'text-green' },
  { label: 'Remaining', value: '7 pts', color: 'text-orange' },
  { label: 'Completion %', value: '93%', color: 'text-purple' },
]
</script>

<style scoped>
.burnup-svg { display: block; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
.bg-blue { background: #1976D2; }
.bg-green { background: #43A047; }
.gap-4 { gap: 16px; }
.gap-1 { gap: 4px; }
</style>
