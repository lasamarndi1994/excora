<template>
  <v-container fluid class="pa-6  mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <div class="d-flex align-center justify-space-between mb-2">
        <h1 class="text-h5 font-weight-bold">Projects</h1>
      </div>
    </div>

    <!-- Recent Spaces Section -->
    <div class="mb-8">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-subtitle-1 text-medium-emphasis">Recent spaces</h2>
        <v-btn variant="text" color="primary" class="text-none" to="/project/spaces">View all projects</v-btn>
      </div>

      <v-row>
        <!-- Dynamic Cards -->
        <v-col v-for="space in spaces" :key="space.key" cols="12" md="4" lg="3">
          <v-card class="project-card h-100 cursor-pointer d-flex flex-column" elevation="0" border
            @click="$router.push('/board')">
            <div class="card-border-left" :class="`bg-${space.borderColor}`"></div>
            <v-card-text class="pa-4 flex-grow-1 d-flex flex-column">
              <div class="d-flex align-start mb-4">
                <v-sheet class="mr-3 rounded d-flex align-center justify-center project-icon"
                  :class="`bg-${space.color}`" width="32" height="32">
                  <v-icon color="white" size="20">{{ space.icon }}</v-icon>
                </v-sheet>
                <div>
                  <h3 class="text-subtitle-2 font-weight-bold mb-0 line-height-1 text-truncate"
                    style="max-width: 140px;" :title="space.name">{{ space.name }}</h3>
                  <span class="text-caption text-medium-emphasis">{{ space.type }}</span>
                </div>
              </div>

              <div class="ml-3 pr-2">
                <div class="text-caption text-medium-emphasis mb-2 mt-2">Quick links</div>

                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-caption text-medium-emphasis">My open work items</span>
                  <v-chip size="x-small" variant="flat" color="surface-variant">0</v-chip>
                </div>

                <div class="d-flex justify-space-between align-center mb-4">
                  <span class="text-caption text-medium-emphasis">Done work items</span>
                </div>
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="px-4 py-2 bg-grey-lighten-4">
              <span class="text-caption font-weight-medium text-medium-emphasis d-flex align-center ml-3">
                1 board <v-icon size="16" class="ml-1">mdi-chevron-down</v-icon>
              </span>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Tabs Section -->
    <v-tabs density="compact" color="primary" class="border-b mb-12" v-model="activeTab">
      <v-tab class="text-none font-weight-medium px-4" value="worked">Worked on</v-tab>
      <v-tab class="text-none font-weight-medium px-4" value="viewed">Viewed</v-tab>
      <v-tab class="text-none font-weight-medium px-4" value="assigned">
        Assigned to me <span class="tab-badge ml-2 text-caption">0</span>
      </v-tab>
      <v-tab class="text-none font-weight-medium px-4" value="starred">Starred</v-tab>
      <v-tab class="text-none font-weight-medium px-4" value="boards">Boards</v-tab>
    </v-tabs>

    <!-- Empty State Content -->
    <v-window v-model="activeTab">
      <!-- Assigned to me tab (Empty state illustration) -->
      <v-window-item value="assigned">
        <div class="d-flex flex-column align-center justify-center text-center py-8">

          <div class="position-relative mb-8 mt-4" style="width: 280px; height: 160px;">

            <!-- Success Badge (Top floating) -->
            <div class="success-badge bg-teal-accent-4 rounded-circle d-flex align-center justify-center pa-2"
              style="width: 56px; height: 56px;">
              <v-icon color="white" size="36">mdi-check-circle</v-icon>
            </div>

            <!-- Laptop Screen -->
            <v-sheet elevation="1" class="laptop-screen bg-grey-lighten-3 d-flex overflow-hidden">
              <!-- Sidebar -->
              <div class="bg-blue-darken-3 h-100" style="width: 25px;"></div>

              <!-- Main Content Area -->
              <div class="bg-white h-100 flex-grow-1 d-flex flex-column pa-3">
                <!-- Top section -->
                <div class="d-flex gap-2 mb-2">
                  <div class="bg-grey-lighten-2 rounded" style="width: 40px; height: 30px;"></div>
                  <div class="d-flex flex-column gap-1 flex-grow-1">
                    <div class="bg-blue-lighten-5 w-100 rounded" style="height: 12px;"></div>
                    <div class="bg-blue-darken-1 w-100 rounded" style="height: 12px;"></div>
                  </div>
                </div>
              </div>
            </v-sheet>

            <!-- Notification Toast (Floating right) -->
            <v-sheet elevation="3" class="notification-toast bg-teal-accent-3 rounded d-flex align-center px-2 shadow">
              <v-sheet class="rounded-circle bg-white opacity-60" width="8" height="8"></v-sheet>
            </v-sheet>

            <!-- Laptop Base/Keyboard -->
            <v-sheet class="laptop-base bg-blue-grey-darken-2 d-flex justify-center align-end pb-1"></v-sheet>
          </div>

          <h2 class="text-h6 font-weight-bold mb-1 mt-4">Find all your open work items in one place</h2>
          <p class="text-body-2 text-medium-emphasis">You have no open work items assigned to you</p>
        </div>
      </v-window-item>

      <!-- Fallback generic empty states -->
      <v-window-item v-for="tab in ['worked', 'viewed', 'starred', 'boards']" :key="tab" :value="tab">
        <div class="text-center py-12 text-medium-emphasis">
          Nothing to display in this tab yet.
        </div>
      </v-window-item>
    </v-window>

  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('assigned')

// Static data for projects (Recent spaces) modeled after SpacesPage.vue data
const spaces = ref([
  {
    name: 'Cryptocurrency Payment Gateway',
    key: 'CPG',
    type: 'Team-managed software',
    icon: 'mdi-poll',
    color: 'red-darken-2',
    borderColor: 'red-lighten-3'
  },
  {
    name: 'Execora',
    key: 'EX',
    type: 'Team-managed software',
    icon: 'mdi-wallet-bifold',
    color: 'blue-darken-3',
    borderColor: 'warning'
  },
  {
    name: 'Project management',
    key: 'PM',
    type: 'Team-managed business',
    icon: 'mdi-rocket-launch',
    color: 'indigo-darken-4',
    borderColor: 'blue-grey-lighten-4'
  },
  {
    name: 'Kanban 1',
    key: 'K1',
    type: 'Team-managed software',
    icon: 'mdi-cellphone-link',
    color: 'blue',
    borderColor: 'blue-lighten-3'
  },
  {
    name: 'Kanban',
    key: 'KAN',
    type: 'Team-managed software',
    icon: 'mdi-cellphone-link',
    color: 'amber-darken-2',
    borderColor: 'amber-lighten-3'
  },
  {
    name: 'Marketing asset creation',
    key: 'MAC',
    type: 'Team-managed business',
    icon: 'mdi-puzzle',
    color: 'cyan-darken-1',
    borderColor: 'cyan-lighten-3'
  },
])
</script>

<style scoped>
/* .max-w-1200 {
  max-width: 1200px;
} */

.line-height-1 {
  line-height: 1.2;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

/* Tab styling adjustments */
:deep(.v-btn--active) {
  color: var(--v-theme-primary);
}

.tab-badge {
  background-color: #f0f0f0;
  color: #42526e;
  border-radius: 12px;
  padding: 0 6px;
  font-weight: 600;
}

/* Project Card Styling */
.project-card {
  position: relative;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  border-radius: 4px;
  background-color: rgb(var(--v-theme-surface));
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(9, 30, 66, 0.15) !important;
}

.card-border-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 1;
}

.project-icon {
  position: relative;
  z-index: 2;
  margin-left: -8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

/* Empty State Illustration Custom CSS */
.success-badge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
}

.laptop-screen {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 180px;
  height: 110px;
  z-index: 1;
  border-top-left-radius: 6px !important;
  border-top-right-radius: 6px !important;
  border: 4px solid #b0bec5;
  border-bottom: none;
}

.laptop-base {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 12px;
  z-index: 2;
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

.notification-toast {
  position: absolute;
  bottom: 35px;
  right: 25px;
  width: 50px;
  height: 16px;
  z-index: 3;
}
</style>
