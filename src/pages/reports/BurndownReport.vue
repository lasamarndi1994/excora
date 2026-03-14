<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="4">
        <v-select v-model="selectedSprint" :items="sprintOptions" item-title="name" item-value="id"
          label="Sprint" variant="outlined" density="compact" hide-details />
      </v-col>
      <v-col cols="auto">
        <v-chip color="blue" variant="tonal" size="small">Ideal remaining: {{ idealRemaining }} pts</v-chip>
      </v-col>
      <v-col cols="auto">
        <v-chip color="red" variant="tonal" size="small">Actual remaining: {{ actualRemaining }} pts</v-chip>
      </v-col>
    </v-row>

    <v-card flat border class="pa-6 mb-6">
      <div class="d-flex align-center mb-4">
        <h3 class="text-subtitle-1 font-weight-bold">Sprint Burndown</h3>
        <v-spacer />
        <div class="d-flex align-center gap-4 text-caption text-medium-emphasis">
          <span class="d-flex align-center gap-1"><span class="legend-line ideal"></span> Ideal</span>
          <span class="d-flex align-center gap-1"><span class="legend-line actual"></span> Actual</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`">
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)"
          stroke="#E0E0E0" stroke-width="1" />
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#9E9E9E">{{ y }}</text>
        <text v-for="(d,i) in days" :key="'x'+i" :x="xS(i)" :y="chartH-8" text-anchor="middle" font-size="11" fill="#9E9E9E">{{ d }}</text>
        <!-- Ideal line -->
        <polyline :points="idealPts" fill="none" stroke="#1976D2" stroke-width="2" stroke-dasharray="6 3" />
        <!-- Actual area -->
        <polygon :points="actualArea" fill="rgba(229,57,53,0.08)" />
        <polyline :points="actualPts" fill="none" stroke="#E53935" stroke-width="2.5" />
        <circle v-for="(v,i) in actual" :key="i" :cx="xS(i)" :cy="yS(v)" r="4" fill="#E53935" stroke="white" stroke-width="1.5" />
      </svg>
    </v-card>

    <!-- Per-member table -->
    <v-card flat border>
      <v-card-title class="text-subtitle-1 font-weight-bold pa-4">Team Performance</v-card-title>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Member</th>
            <th>Assigned</th>
            <th>Completed</th>
            <th>Remaining</th>
            <th>Progress</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in members" :key="m.name">
            <td class="py-2">
              <div class="d-flex align-center gap-2">
                <v-avatar size="28"><v-img :src="m.avatar" /></v-avatar>
                {{ m.name }}
              </div>
            </td>
            <td>{{ m.assigned }}</td>
            <td>{{ m.completed }}</td>
            <td>{{ m.assigned - m.completed }}</td>
            <td style="min-width:120px">
              <v-progress-linear :model-value="(m.completed/m.assigned)*100" color="green" height="6" rounded />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
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

const days = ['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7','Day 8','Day 9','Day 10']
const ideal = [100, 89, 78, 67, 56, 45, 34, 23, 12, 0]
const actual = [100, 95, 80, 72, 65, 55, 50, 40, 28, 12]

const idealRemaining = computed(() => ideal[ideal.length - 1])
const actualRemaining = computed(() => actual[actual.length - 1])

const yGrid = [0, 25, 50, 75, 100]
function xS(i: number) { return padL + (i / (days.length - 1)) * (chartW - padL - padR) }
function yS(v: number) { return padT + (1 - v / maxVal) * (chartH - padT - padB) }

const idealPts = computed(() => ideal.map((v, i) => `${xS(i)},${yS(v)}`).join(' '))
const actualPts = computed(() => actual.map((v, i) => `${xS(i)},${yS(v)}`).join(' '))
const actualArea = computed(() => {
  const top = actual.map((v, i) => `${xS(i)},${yS(v)}`).join(' ')
  return `${top} ${xS(days.length-1)},${yS(0)} ${xS(0)},${yS(0)}`
})

const members = computed(() =>
  store.users.map((u, idx) => ({
    name: u.name,
    avatar: u.avatar,
    assigned: [20, 25, 18, 15][idx] ?? 10,
    completed: [18, 20, 12, 10][idx] ?? 8,
  }))
)
</script>

<style scoped>
.gap-4 { gap: 16px; }
.gap-2 { gap: 8px; }
.gap-1 { gap: 4px; }
.legend-line { display: inline-block; width: 24px; height: 3px; border-radius: 2px; margin-right: 4px; vertical-align: middle; }
.ideal { background: #1976D2; }
.actual { background: #E53935; }
</style>
