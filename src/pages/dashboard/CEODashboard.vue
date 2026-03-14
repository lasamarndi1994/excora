<template>
  <v-container fluid class="fill-height dashboard-container pa-6">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold text-high-emphasis modern-header">CEO Dashboard</h1>
            <p class="text-subtitle-1 text-medium-emphasis">Executive Overview & Strategic Metrics</p>
          </div>
          <v-btn color="primary" variant="flat" prepend-icon="mdi-download" class="text-capitalize" rounded="lg">Export
            Report</v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Key Metrics Row -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(metric, index) in metrics" :key="index">
        <v-card class="modern-card h-100 pa-4" flat>
          <div class="d-flex align-center justify-space-between mb-4">
            <v-avatar :color="metric.color" variant="tonal" rounded="lg" size="48">
              <v-icon :color="metric.color" size="24">{{ metric.icon }}</v-icon>
            </v-avatar>
            <v-chip :color="metric.trend > 0 ? 'success' : 'error'" size="small" variant="tonal" label
              class="font-weight-bold">
              <v-icon start size="small">{{ metric.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
              {{ Math.abs(metric.trend) }}%
            </v-chip>
          </div>
          <div class="text-h3 font-weight-bold mb-1">{{ metric.value }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ metric.label }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card class="modern-card h-100 pa-6" flat>
          <div class="d-flex align-center justify-space-between mb-6">
            <h3 class="text-h6 font-weight-bold">Revenue Growth</h3>
            <v-btn-toggle v-model="revenuePeriod" density="compact" variant="outlined" color="primary" rounded="xl"
              divided>
              <v-btn value="week" size="small" class="text-capitalize">Week</v-btn>
              <v-btn value="month" size="small" class="text-capitalize">Month</v-btn>
              <v-btn value="year" size="small" class="text-capitalize">Year</v-btn>
            </v-btn-toggle>
          </div>
          <div class="d-flex align-center justify-center bg-surface-variant rounded-xl" style="min-height: 300px;">
            <!-- Placeholder for Chart -->
            <div class="text-medium-emphasis d-flex flex-column align-center">
              <v-icon size="64" color="primary" class="mb-4 opacity-50">mdi-chart-areaspline</v-icon>
              <span class="text-overline">Revenue Chart Visualization</span>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="modern-card h-100 pa-6" flat>
          <h3 class="text-h6 font-weight-bold mb-6">Market Share</h3>
          <div class="d-flex align-center justify-center flex-column" style="min-height: 300px;">
            <v-progress-circular :model-value="68" :size="200" :width="24" color="primary" bg-color="surface-variant">
              <div class="text-center">
                <div class="text-h3 font-weight-black text-gradient-primary">68%</div>
                <div class="text-caption text-medium-emphasis font-weight-bold text-uppercase mt-1">Domination</div>
              </div>
            </v-progress-circular>
            <div class="d-flex justify-space-between w-100 mt-8 px-2 gap-4">
              <div class="text-center flex-grow-1 pa-2 rounded-lg bg-surface-variant">
                <div class="text-subtitle-2 font-weight-bold">Competitor A</div>
                <div class="text-caption text-error font-weight-bold">12%</div>
              </div>
              <div class="text-center flex-grow-1 pa-2 rounded-lg bg-surface-variant">
                <div class="text-subtitle-2 font-weight-bold">Competitor B</div>
                <div class="text-caption text-warning font-weight-bold">20%</div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activities / AI Insights -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="modern-card h-100 pa-2" flat>
          <v-card-title class="d-flex align-center py-4 px-4">
            <v-avatar color="purple-lighten-5" size="40" class="mr-3">
              <v-icon color="purple" size="24">mdi-robot-excited-outline</v-icon>
            </v-avatar>
            <span class="font-weight-bold">AI Strategic Insights</span>
          </v-card-title>
          <v-list lines="two" class="bg-transparent pa-2">
            <v-list-item v-for="(insight, i) in insights" :key="i" rounded="xl" class="mb-2 hover-bg-surface-variant">
              <template v-slot:prepend>
                <div class="pa-2 bg-surface-variant rounded-lg mr-4">
                  <v-icon :icon="insight.icon" color="primary"></v-icon>
                </div>
              </template>
              <v-list-item-title class="font-weight-bold mb-1">{{ insight.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ insight.description }}</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn variant="text" size="small" color="primary" icon="mdi-arrow-right"></v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="modern-card h-100 pa-4" flat>
          <v-card-title class="font-weight-bold mb-4">Global Expansion Targets</v-card-title>
          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left text-medium-emphasis font-weight-bold">Region</th>
                <th class="text-left text-medium-emphasis font-weight-bold">Status</th>
                <th class="text-right text-medium-emphasis font-weight-bold">Projected ARR</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in regions" :key="item.name">
                <td class="font-weight-bold py-4">
                  <div class="d-flex align-center">
                    <v-icon size="small" class="mr-2 text-medium-emphasis">mdi-earth</v-icon>
                    {{ item.name }}
                  </div>
                </td>
                <td class="py-4">
                  <v-chip size="small" :color="item.color" variant="tonal" class="font-weight-bold" label>{{ item.status
                    }}</v-chip>
                </td>
                <td class="text-right font-weight-bold py-4">{{ item.arr }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const revenuePeriod = ref('month');

const metrics = [
  { label: 'Total Revenue', value: '$8.4M', trend: 12.5, color: 'primary', icon: 'mdi-currency-usd' },
  { label: 'Active Users', value: '124K', trend: 8.2, color: 'success', icon: 'mdi-account-group' },
  { label: 'Churn Rate', value: '2.1%', trend: -0.5, color: 'error', icon: 'mdi-chart-line-variant' }, // negative trend is good for churn, but formatted visually
  { label: 'NPS Score', value: '72', trend: 4.0, color: 'warning', icon: 'mdi-star' },
];

const insights = [
  {
    title: 'Expansion Opportunity',
    description: 'User growth in APAC region suggests opening a dedicated server node.',
    icon: 'mdi-earth',
  },
  {
    title: 'Resource Optimization',
    description: 'Cloud infrastructure costs can be reduced by 15% via reserved instances.',
    icon: 'mdi-cloud-off-outline',
  },
  {
    title: 'Competitor Alert',
    description: 'New entrant in the enterprise sector pricing 20% below our standard.',
    icon: 'mdi-shield-alert',
  },
];

const regions = [
  { name: 'North America', status: 'Active', color: 'success', arr: '$4.2M' },
  { name: 'Europe', status: 'Expanding', color: 'info', arr: '$2.1M' },
  { name: 'Asia Pacific', status: 'Planning', color: 'warning', arr: '$1.5M' },
  { name: 'South America', status: 'Research', color: 'grey', arr: '$600K' },
];
</script>

<style scoped>
@import '@/styles/dashboard.css';

.hover-bg-surface-variant:hover {
  background-color: rgb(var(--v-theme-surface-variant));
}
</style>
