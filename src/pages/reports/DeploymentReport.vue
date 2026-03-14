<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="4">
        <v-select v-model="period" :items="['Weekly', 'Monthly', 'Quarterly']"
          label="Period" variant="outlined" density="compact" hide-details />
      </v-col>
      <v-col cols="auto">
        <v-chip color="green" variant="tonal" size="small">Total Deployments: {{ totalDeploys }}</v-chip>
      </v-col>
      <v-col cols="auto">
        <v-chip color="blue" variant="tonal" size="small">Success Rate: {{ successRate }}%</v-chip>
      </v-col>
      <v-col cols="auto">
        <v-chip color="red" variant="tonal" size="small">Failed: {{ failedDeploys }}</v-chip>
      </v-col>
    </v-row>

    <!-- Bar + Line combo chart -->
    <v-card flat border class="pa-6 mb-6">
      <div class="d-flex align-center mb-4">
        <h3 class="text-subtitle-1 font-weight-bold">Deployment Frequency</h3>
        <v-spacer />
        <div class="d-flex align-center gap-4 text-caption text-medium-emphasis">
          <span class="d-flex align-center gap-1"><span class="legend-dot success-dot"></span> Success</span>
          <span class="d-flex align-center gap-1"><span class="legend-dot fail-dot"></span> Failed</span>
          <span class="d-flex align-center gap-1"><span class="legend-line trend-line"></span> Trend</span>
        </div>
      </div>
      <svg width="100%" :height="chartH" :viewBox="`0 0 ${chartW} ${chartH}`">
        <!-- Grid -->
        <line v-for="y in yGrid" :key="y" x1="50" :y1="yS(y)" :x2="chartW-20" :y2="yS(y)" stroke="#E0E0E0" stroke-width="1" />
        <text v-for="y in yGrid" :key="'l'+y" x="44" :y="yS(y)+4" text-anchor="end" font-size="11" fill="#9E9E9E">{{ y }}</text>
        <!-- Bars -->
        <g v-for="(d, i) in data" :key="i">
          <!-- Success bar -->
          <rect :x="barX(i)" :y="yS(d.success)" :width="barW" :height="yS(0)-yS(d.success)"
            fill="#43A047" rx="3" />
          <!-- Failed bar stacked on top -->
          <rect :x="barX(i)" :y="yS(d.success + d.failed)" :width="barW" :height="yS(0)-yS(d.failed)"
            fill="#E53935" rx="3" opacity="0.7" />
          <text :x="barX(i) + barW/2" :y="chartH-8" text-anchor="middle" font-size="10" fill="#9E9E9E">{{ d.label }}</text>
        </g>
        <!-- Trend line -->
        <polyline :points="trendPts" fill="none" stroke="#1976D2" stroke-width="2" stroke-dasharray="5 3" />
        <circle v-for="(d, i) in data" :key="'t'+i"
          :cx="barX(i) + barW/2" :cy="yS(d.success + d.failed)" r="3.5"
          fill="#1976D2" stroke="white" stroke-width="1.5" />
      </svg>
    </v-card>

    <!-- DORA Metrics -->
    <v-row class="mb-6">
      <v-col v-for="m in doraMetrics" :key="m.label" cols="6" sm="3">
        <v-card flat border class="pa-4 text-center">
          <v-avatar :color="m.color" variant="tonal" size="40" class="mb-2">
            <v-icon :color="m.color" size="20">{{ m.icon }}</v-icon>
          </v-avatar>
          <div class="text-h6 font-weight-bold">{{ m.value }}</div>
          <div class="text-caption text-medium-emphasis mt-1">{{ m.label }}</div>
          <v-chip size="x-small" :color="m.rating === 'Elite' ? 'green' : m.rating === 'High' ? 'blue' : 'orange'"
            variant="tonal" class="mt-2" label>{{ m.rating }}</v-chip>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Deployments -->
    <v-card flat border>
      <v-card-title class="text-subtitle-1 font-weight-bold pa-4">Recent Deployments</v-card-title>
      <v-table density="compact">
        <thead>
          <tr>
            <th>Version</th>
            <th>Environment</th>
            <th>Date</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Deployed By</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in recentDeploys" :key="d.version">
            <td class="py-2 font-weight-medium">{{ d.version }}</td>
            <td><v-chip size="x-small" :color="d.env === 'Production' ? 'red' : d.env === 'Staging' ? 'orange' : 'blue'" variant="tonal" label>{{ d.env }}</v-chip></td>
            <td class="text-caption text-medium-emphasis">{{ d.date }}</td>
            <td>{{ d.duration }}</td>
            <td><v-chip size="x-small" :color="d.status === 'Success' ? 'green' : 'red'" variant="tonal" label>{{ d.status }}</v-chip></td>
            <td class="text-caption">{{ d.by }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const period = ref('Weekly')

const chartW = 700, chartH = 260
const padL = 55, padR = 20, padT = 20, padB = 30
const maxVal = 12
const yGrid = [0, 3, 6, 9, 12]

const data = [
  { label: 'W1', success: 5, failed: 1 },
  { label: 'W2', success: 7, failed: 0 },
  { label: 'W3', success: 4, failed: 2 },
  { label: 'W4', success: 8, failed: 1 },
  { label: 'W5', success: 6, failed: 0 },
  { label: 'W6', success: 9, failed: 1 },
  { label: 'W7', success: 7, failed: 2 },
  { label: 'W8', success: 10, failed: 0 },
]

const groupW = (chartW - padL - padR) / data.length
const barW = Math.min(groupW * 0.55, 36)

function barX(i: number) { return padL + i * groupW + (groupW - barW) / 2 }
function yS(v: number) { return padT + (1 - v / maxVal) * (chartH - padT - padB) }

const trendPts = computed(() =>
  data.map((d, i) => `${barX(i) + barW / 2},${yS(d.success + d.failed)}`).join(' ')
)

const totalDeploys = computed(() => data.reduce((a, d) => a + d.success + d.failed, 0))
const failedDeploys = computed(() => data.reduce((a, d) => a + d.failed, 0))
const successRate = computed(() => Math.round(((totalDeploys.value - failedDeploys.value) / totalDeploys.value) * 100))

const doraMetrics = [
  { label: 'Deploy Frequency', value: '8/week', icon: 'mdi-rocket-launch', color: 'green', rating: 'Elite' },
  { label: 'Lead Time', value: '1.2 days', icon: 'mdi-clock-fast', color: 'blue', rating: 'High' },
  { label: 'Change Failure Rate', value: '8%', icon: 'mdi-alert-circle', color: 'orange', rating: 'Medium' },
  { label: 'MTTR', value: '45 min', icon: 'mdi-restore', color: 'purple', rating: 'High' },
]

const recentDeploys = [
  { version: 'v2.4.1', env: 'Production', date: 'Mar 14, 2026', duration: '4m 12s', status: 'Success', by: 'Lasam' },
  { version: 'v2.4.0', env: 'Production', date: 'Mar 12, 2026', duration: '3m 58s', status: 'Success', by: 'Alana Song' },
  { version: 'v2.3.9', env: 'Staging', date: 'Mar 11, 2026', duration: '2m 30s', status: 'Failed', by: 'Mitch' },
  { version: 'v2.3.8', env: 'Production', date: 'Mar 10, 2026', duration: '4m 05s', status: 'Success', by: 'Rupert' },
  { version: 'v2.3.7', env: 'Dev', date: 'Mar 9, 2026', duration: '1m 45s', status: 'Success', by: 'Lasam' },
]
</script>

<style scoped>
.gap-4 { gap: 16px; }
.gap-1 { gap: 4px; }
.legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 4px; }
.success-dot { background: #43A047; }
.fail-dot { background: #E53935; }
.legend-line { display: inline-block; width: 20px; height: 3px; border-radius: 2px; margin-right: 4px; vertical-align: middle; }
.trend-line { background: #1976D2; }
</style>
