<template>
    <v-container fluid class="fill-height dashboard-container pa-6">
        <v-row>
            <v-col cols="12">
                <div class="d-flex align-center justify-space-between mb-6">
                    <div>
                        <h1 class="text-h4 font-weight-bold text-high-emphasis modern-header">CTO Dashboard</h1>
                        <p class="text-subtitle-1 text-medium-emphasis">System Health, Engineering Performance &
                            Infrastructure</p>
                    </div>
                    <v-btn-toggle v-model="timeRange" density="compact" color="primary" variant="outlined" divided
                        rounded="xl">
                        <v-btn value="24h" class="text-capitalize">24h</v-btn>
                        <v-btn value="7d" class="text-capitalize">7d</v-btn>
                        <v-btn value="30d" class="text-capitalize">30d</v-btn>
                    </v-btn-toggle>
                </div>
            </v-col>
        </v-row>

        <!-- System Health Row -->
        <v-row class="mb-6">
            <v-col cols="12" md="3">
                <v-card class="modern-card h-100 pa-5" flat>
                    <div class="text-overline font-weight-bold mb-2 text-medium-emphasis">System Uptime</div>
                    <div class="d-flex align-end mb-4">
                        <span class="text-h3 font-weight-bold text-success">99.99%</span>
                        <span class="text-caption text-medium-emphasis mb-1 ml-2 font-weight-bold">Target: 99.95%</span>
                    </div>
                    <v-progress-linear model-value="99.99" color="success" height="6" rounded
                        bg-color="success-lighten-4"></v-progress-linear>
                    <div class="mt-4 text-caption text-medium-emphasis d-flex align-center">
                        <v-icon size="small" color="success" class="mr-1">mdi-check-circle-outline</v-icon>
                        No major outages in 30 days.
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-card class="modern-card h-100 pa-5" flat>
                    <div class="text-overline font-weight-bold mb-2 text-medium-emphasis">Avg. API Latency</div>
                    <div class="d-flex align-end mb-4">
                        <span class="text-h3 font-weight-bold text-primary">45ms</span>
                        <v-chip color="success" size="x-small" variant="tonal" class="ml-2 mb-1 font-weight-bold">
                            <v-icon start size="x-small">mdi-arrow-down</v-icon> 12%
                        </v-chip>
                    </div>
                    <!-- Sparkline placeholder -->
                    <div class="d-flex align-end justify-space-between" style="height: 40px;">
                        <div v-for="n in 10" :key="n" class="bg-primary rounded-t opacity-80"
                            :style="`width: 6px; height: ${Math.random() * 100}%`"></div>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-card class="modern-card h-100 pa-5" flat>
                    <div class="text-overline font-weight-bold mb-2 text-medium-emphasis">Error Rate</div>
                    <div class="d-flex align-end mb-4">
                        <span class="text-h3 font-weight-bold text-error">0.02%</span>
                        <v-chip color="error" size="x-small" variant="tonal" class="ml-2 mb-1 font-weight-bold">
                            <v-icon start size="x-small">mdi-arrow-up</v-icon> 0.01%
                        </v-chip>
                    </div>
                    <div class="text-caption text-error font-weight-medium bg-error-lighten-5 px-2 py-1 rounded">
                        <v-icon size="small" class="mr-1">mdi-alert-circle-outline</v-icon> Spike: Payment Service
                        (02:00 AM)
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-card class="modern-card h-100 pa-5" flat>
                    <div class="text-overline font-weight-bold mb-2 text-medium-emphasis">Deployments (Today)</div>
                    <div class="d-flex align-end mb-4">
                        <span class="text-h3 font-weight-bold text-info">14</span>
                        <span class="text-caption text-medium-emphasis mb-1 ml-2 font-weight-bold">3 Pending</span>
                    </div>
                    <div class="d-flex gap-2">
                        <v-chip size="small" color="success" variant="flat" class="font-weight-bold">Success:
                            12</v-chip>
                        <v-chip size="small" color="error" variant="flat" class="font-weight-bold">Failed: 2</v-chip>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Detailed Metrics -->
        <v-row class="mb-6">
            <v-col cols="12" md="8">
                <v-card class="modern-card h-100" flat>
                    <v-tabs v-model="tab" bg-color="transparent" color="primary" class="border-b px-4">
                        <v-tab value="infrastructure" class="text-capitalize font-weight-bold">Infrastructure
                            Cost</v-tab>
                        <v-tab value="security" class="text-capitalize font-weight-bold">Security
                            Vulnerabilities</v-tab>
                        <v-tab value="techdebt" class="text-capitalize font-weight-bold">Tech Debt</v-tab>
                    </v-tabs>

                    <v-card-text class="pa-0" style="height: 350px;">
                        <v-window v-model="tab" class="fill-height">
                            <v-window-item value="infrastructure"
                                class="fill-height d-flex align-center justify-center">
                                <div class="d-flex flex-column align-center text-medium-emphasis">
                                    <div class="bg-primary-lighten-5 pa-6 rounded-circle mb-4">
                                        <v-icon size="48" color="primary">mdi-cloud-outline</v-icon>
                                    </div>
                                    <div class="text-h6 font-weight-bold text-high-emphasis">AWS/Azure Cost Trends Chart
                                    </div>
                                    <div class="text-body-2 text-medium-emphasis mt-2">Monthly Spend: $12.4k (Forecast:
                                        $14k)</div>
                                    <v-btn variant="outlined" color="primary"
                                        class="mt-4 rounded-lg text-capitalize">View Detailed Report</v-btn>
                                </div>
                            </v-window-item>
                            <v-window-item value="security" class="fill-height pa-4">
                                <v-list bg-color="transparent">
                                    <v-list-item class="mb-2 border rounded-lg" base-color="error"
                                        title="Critical: Log4j CVE Variant" subtitle="Detected in Legacy Auth Service">
                                        <template v-slot:prepend><v-icon color="error"
                                                class="mr-2">mdi-shield-alert</v-icon></template>
                                        <template v-slot:append><v-btn size="small" color="error" variant="flat"
                                                class="font-weight-bold ml-2">Patch Now</v-btn></template>
                                    </v-list-item>
                                    <v-list-item class="mb-2 border rounded-lg" title="Medium: Outdated Dependency"
                                        subtitle="Lodash < 4.17.21">
                                        <template v-slot:prepend><v-icon color="warning"
                                                class="mr-2">mdi-shield-alert-outline</v-icon></template>
                                        <template v-slot:append><v-btn size="small" color="warning" variant="tonal"
                                                class="font-weight-bold ml-2">Schedule</v-btn></template>
                                    </v-list-item>
                                    <v-list-item class="mb-2 border rounded-lg" title="Low: Missing Headers"
                                        subtitle="X-Frame-Options in Admin Panel">
                                        <template v-slot:prepend><v-icon color="info"
                                                class="mr-2">mdi-shield-check-outline</v-icon></template>
                                        <template v-slot:append><v-chip size="small" variant="text">Auto-fix
                                                available</v-chip></template>
                                    </v-list-item>
                                </v-list>
                            </v-window-item>
                            <v-window-item value="techdebt" class="fill-height d-flex align-center justify-center">
                                <div class="d-flex flex-column align-center text-medium-emphasis">
                                    <v-icon size="64" class="mb-4">mdi-code-braces</v-icon>
                                    <div class="text-h6">Code Quality Trends</div>
                                    <div class="text-caption">SonarQube Rating: A-</div>
                                </div>
                            </v-window-item>
                        </v-window>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="modern-card h-100 pa-6" flat>
                    <div class="d-flex justify-space-between align-center mb-6">
                        <h3 class="text-h6 font-weight-bold">Team Velocity</h3>
                        <v-icon color="medium-emphasis">mdi-dots-horizontal</v-icon>
                    </div>

                    <div v-for="(team, i) in teams" :key="i" class="mb-6">
                        <div class="d-flex justify-space-between mb-2">
                            <span class="font-weight-bold text-body-2">{{ team.name }}</span>
                            <span class="text-caption font-weight-bold text-medium-emphasis">{{ team.velocity }}
                                pts</span>
                        </div>
                        <v-progress-linear :model-value="team.progress" :color="team.color" rounded height="8"
                            bg-color="surface-variant"></v-progress-linear>
                    </div>

                    <v-card variant="tonal" color="warning" class="mt-6 rounded-lg pa-3 d-flex align-start">
                        <v-icon color="warning" class="mr-3" size="20">mdi-alert-circle-outline</v-icon>
                        <span class="text-caption font-weight-medium text-high-emphasis"
                            style="line-height: 1.4;">Frontend Team is
                            10% below capacity due to holidays. Consider adjusting sprint scope.</span>
                    </v-card>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const timeRange = ref('24h');
const tab = ref('infrastructure');

const teams = [
    { name: 'Core Platform', velocity: 45, progress: 85, color: 'primary' },
    { name: 'Frontend Experience', velocity: 32, progress: 60, color: 'info' },
    { name: 'Mobile App', velocity: 28, progress: 75, color: 'success' },
    { name: 'Data Engineering', velocity: 38, progress: 90, color: 'purple' },
];
</script>

<style scoped>
@import '@/styles/dashboard.css';

.v-card {
    transition: transform 0.2s;
}
</style>
