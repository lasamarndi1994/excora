<template>
  <v-container fluid class="pa-0 h-100 d-flex flex-column whitespace-nowrap overflow-hidden bg-white">
    <!-- Project Header -->
    <ProjectHeader active-tab="report" />

    <!-- Reports Content -->
    <div class="flex-grow-1 px-8 py-8 overflow-y-auto bg-white">
      <div class="mx-auto">
        <v-row>
          <v-col v-for="report in reports" :key="report.title" cols="12" sm="6" md="4" lg="3">
            <v-card variant="outlined" class="h-100 d-flex flex-column border-card hover-lift cursor-pointer rounded"
              elevation="0" @click="openReport(report.imgClass)">
              <!-- Chart Visual Area -->
              <div
                class="chart-preview-container bg-white position-relative overflow-hidden pa-4 pb-0 d-flex align-end justify-center">
                <div v-if="report.imgClass === 'burnup'" class="w-100 h-100 position-relative">
                  <div class="grey-overlay"></div>
                  <!-- Mock SVG lines -->
                  <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
                    <path d="M 0,10 L 10,10 L 10,25 L 80,25 L 80,45 L 90,45 L 90,55 L 100,55" fill="none"
                      stroke="#B0BEC5" stroke-width="2" />
                    <path d="M 0,35 L 20,35 L 30,50 L 55,50 L 70,30 L 90,30 L 100,20" fill="none" stroke="#78909C"
                      stroke-width="2" />
                    <path d="M 0,55 L 100,55" fill="none" stroke="#E0E0E0" stroke-width="2" />
                  </svg>
                </div>

                <div v-if="report.imgClass === 'burndown'" class="w-100 h-100 position-relative">
                  <div class="grey-overlay"></div>
                  <!-- Mock SVG lines -->
                  <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
                    <path d="M 0,10 L 25,25 L 50,40 L 75,55 L 100,55" fill="none" stroke="#B0BEC5" stroke-width="2" />
                    <path d="M 0,10 L 15,10 L 15,25 L 35,25 L 35,40 L 60,40 L 60,55 L 100,55" fill="none"
                      stroke="#78909C" stroke-width="2" />
                  </svg>
                </div>

                <div v-if="report.imgClass === 'velocity'"
                  class="w-100 h-100 position-relative d-flex align-end justify-space-between px-2 pt-4 pb-2 gap-1">
                  <v-sheet v-for="h in [40, 50, 60, 45, 75, 55]" :key="h" :height="h + '%'" width="12%"
                    color="grey-lighten-1" class="rounded-sm"></v-sheet>
                  <div style="position: absolute; left: 0; right: 0; bottom: 35%; border-bottom: 2px dashed #9E9E9E;">
                  </div>
                </div>

                <div v-if="report.imgClass === 'cfd'" class="w-100 h-100 position-relative">
                  <!-- Stacked area chart mock -->
                  <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none"
                    style="position: absolute; bottom: 0; left: 0;">
                    <path d="M0,60 L0,20 Q10,15 20,25 T40,20 T60,10 T80,30 T100,10 L100,60 Z" fill="#CFD8DC"
                      stroke="#90A4AE" stroke-width="1.5" />
                    <path d="M0,60 L0,30 Q10,25 20,40 T40,30 T60,20 T80,45 T100,20 L100,60 Z" fill="#E1BEE7"
                      stroke="#BA68C8" stroke-width="1.5" />
                    <path d="M0,60 L0,45 Q10,40 20,50 T40,40 T60,35 T80,50 T100,35 L100,60 Z" fill="#FFF59D"
                      stroke="#FFD54F" stroke-width="1.5" />
                    <path d="M0,60 L0,55 L100,55 L100,60 Z" fill="#A5D6A7" stroke="#81C784" stroke-width="1.5" />
                  </svg>
                </div>

                <div v-if="report.imgClass === 'cycletime'" class="w-100 h-100 position-relative pt-4 px-2">
                  <div style="width: 100%; border-bottom: 2px dashed #B0BEC5; margin-top: 15px;">
                  </div>
                  <div
                    style="position: absolute; top: 12px; left: 15px; width: 6px; height: 6px; border-radius: 50%; background-color: #5C6BC0;">
                  </div>
                  <div
                    style="position: absolute; top: 8px; left: 35px; width: 6px; height: 6px; border-radius: 50%; background-color: #5C6BC0;">
                  </div>
                  <div
                    style="position: absolute; top: 22px; left: 55px; width: 6px; height: 6px; border-radius: 50%; background-color: #5C6BC0;">
                  </div>
                  <div
                    style="position: absolute; top: 4px; left: 75px; width: 6px; height: 6px; border-radius: 50%; background-color: #5C6BC0;">
                  </div>
                  <div
                    style="position: absolute; top: 18px; left: 88px; width: 6px; height: 6px; border-radius: 50%; background-color: #5C6BC0;">
                  </div>

                  <div class="mt-4">
                    <div class="d-flex align-center mb-1">
                      <v-icon size="10" color="orange" class="mr-1">mdi-arrow-up-circle</v-icon>
                      <v-sheet width="80%" height="8" color="grey-lighten-3" class="rounded"></v-sheet>
                    </div>
                    <div class="d-flex align-center">
                      <v-icon size="10" color="orange" class="mr-1">mdi-arrow-up-circle</v-icon>
                      <v-sheet width="90%" height="8" color="grey-lighten-3" class="rounded"></v-sheet>
                    </div>
                  </div>
                </div>

                <div v-if="report.imgClass === 'deployment'"
                  class="w-100 h-100 position-relative pb-4 px-2 d-flex flex-column justify-end">
                  <div class="d-flex align-end justify-space-between gap-1 w-100 position-relative z-1">
                    <v-sheet v-for="h in [50, 40, 60, 45, 65]" :key="h" :height="h + '%'" width="16%"
                      color="grey-lighten-1" class="rounded-sm"></v-sheet>
                    <v-sheet height="70%" width="16%" color="green-lighten-1" class="rounded-sm"></v-sheet>
                  </div>
                  <div
                    style="position: absolute; left: 0; right: 0; bottom: 35%; border-bottom: 1px dashed #9E9E9E; z-index: 0;">
                  </div>
                  <!-- Line below bars -->
                  <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none"
                    style="position: absolute; bottom: 10px; left: 0; z-index: 2;">
                    <path d="M0,10 Q15,5 25,10 T50,8 T75,10 T100,15" fill="none" stroke="#64B5F6" stroke-width="1.5" />
                    <circle cx="100" cy="15" r="3" fill="#1976D2" fill-opacity="0.3" stroke="#1976D2"
                      stroke-width="1" />
                    <circle cx="100" cy="15" r="1.5" fill="#1976D2" />
                  </svg>
                </div>

                <!-- Requires Sprints Badge -->
                <div v-if="report.requiresSprints"
                  class="requires-sprints-badge bg-orange-lighten-4 text-orange-darken-4 font-weight-bold text-uppercase px-2 rounded-sm text-caption">
                  Requires Sprints
                </div>
              </div>
              <v-divider></v-divider>
              <!-- Card Content -->
              <div class="pa-4 flex-grow-1">
                <h3 class="text-subtitle-2 font-weight-bold mb-2">{{ report.title }}</h3>
                <p class="text-caption text-medium-emphasis card-desc">{{ report.desc }}</p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProjectHeader from '@/components/ProjectHeader.vue'

const router = useRouter()

function openReport(imgClass: string) {
  router.push({ name: 'ReportDetail', params: { id: imgClass } })
}

const reports = ref([
  {
    title: 'Burnup report',
    desc: "Visualise a sprint's completed work and compare it with its total scope. Use these insights to track progress toward sprint completion.",
    requiresSprints: true,
    imgClass: 'burnup'
  },
  {
    title: 'Sprint burndown chart',
    desc: "Track and manage the total work remaining within a sprint. After the sprint, summarise both team and individual performance.",
    requiresSprints: true,
    imgClass: 'burndown'
  },
  {
    title: 'Velocity report',
    desc: "Predict the amount of work your team can commit to in future sprints by seeing and reviewing the amount of value delivered in previous ones.",
    requiresSprints: true,
    imgClass: 'velocity'
  },
  {
    title: 'Cumulative flow diagram',
    desc: "Shows the statuses of your project's work items over time. See which columns accumulate more work items, and identify bottlenecks in your workflow.",
    requiresSprints: false,
    imgClass: 'cfd'
  },
  {
    title: 'Cycle Time Report',
    desc: "Understand how much time it takes to ship work items through the deployment pipeline and how to deal with outliers.",
    requiresSprints: false,
    imgClass: 'cycletime'
  },
  {
    title: 'Deployment Frequency Report',
    desc: "Understand your deployment frequency to understand risk and how often you are shipping value to your customers.",
    requiresSprints: false,
    imgClass: 'deployment'
  }
])
</script>

<style scoped>
.max-w-1200 {
  max-width: 1200px;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

:deep(.v-btn--active) {
  color: var(--v-theme-primary);
}

.border-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.2s;
}

.hover-lift:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.chart-preview-container {
  height: 120px;
}

.grey-overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 15%;
  width: 30%;
  background-color: rgba(0, 0, 0, 0.04);
}

.requires-sprints-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 10px !important;
  letter-spacing: 0.5px;
  z-index: 10;
}

.z-1 {
  z-index: 1;
}

.card-desc {
  line-height: 1.4;
  white-space: normal;
  /* Allow text wrapping */
}
</style>
