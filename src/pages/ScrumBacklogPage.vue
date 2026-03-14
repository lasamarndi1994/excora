<template>
  <v-container fluid class="pa-0 h-100 d-flex flex-column whitespace-nowrap overflow-hidden bg-white">
    <!-- Project Header -->
    <ProjectHeader active-tab="backlog" />

    <!-- Toolbar area -->
    <div class="px-6 py-4 d-flex align-center gap-4 border-b">
      <v-text-field density="compact" variant="outlined" placeholder="Search backlog..."
        prepend-inner-icon="mdi-magnify" hide-details width="200" max-width="200"
        class="bg-white mr-2 flex-grow-0 custom-search" color="primary"></v-text-field>

      <v-avatar color="orange-darken-1" size="32" class="text-white text-caption font-weight-bold">
        SB
      </v-avatar>

      <v-btn variant="outlined" class="text-none text-medium-emphasis border-card ml-2"
        prepend-icon="mdi-filter-variant" size="small" color="grey-darken-1">
        Filter
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn variant="outlined" class="text-none text-medium-emphasis border-card" size="small"
        prepend-icon="mdi-arrow-collapse-down">
      </v-btn>

      <v-btn variant="outlined" class="text-none text-medium-emphasis border-card ml-2" size="small"
        prepend-icon="mdi-wrench">
      </v-btn>

      <v-btn variant="outlined" class="text-none text-medium-emphasis border-card ml-2" size="small"
        icon="mdi-dots-horizontal">
      </v-btn>
    </div>

    <!-- Backlog Content Area -->
    <div class="flex-grow-1 px-8 py-6 overflow-y-auto bg-white">
      <div class=" mx-auto">
        <!-- Sprint 1 Plan -->
        <div class="mb-8">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center cursor-pointer">
              <!-- Add checkbox from screenshot -->
              <v-checkbox-btn density="compact" color="primary" class="mr-2" v-if="isSprintActive"></v-checkbox-btn>
              <v-icon size="20" class="mr-1 text-medium-emphasis">mdi-chevron-down</v-icon>

              <h2 class="text-subtitle-1 font-weight-bold mb-0 mr-2">{{ sprintDetails.name }}</h2>

              <span v-if="isSprintActive" class="text-caption text-medium-emphasis mr-2">
                {{ formatSprintDates(sprintDetails.startDate, sprintDetails.endDate) }}
              </span>

              <v-btn v-if="!isSprintActive" variant="text" size="small" prepend-icon="mdi-pencil-outline"
                class="text-none text-medium-emphasis" style="font-size: 11px;"
                @click="isStartSprintDialogOpen = true">Add dates</v-btn>
              <span class="text-caption text-medium-emphasis ml-1">({{ sprintIssues.length }} work item{{
                sprintIssues.length === 1 ? '' : 's' }})</span>
            </div>

            <div class="d-flex align-center gap-3">
              <div class="d-flex gap-1">
                <v-chip size="x-small" color="grey-lighten-2"
                  class="text-grey-darken-2 font-weight-bold rounded-sm">0</v-chip>
                <v-chip size="x-small" color="blue-lighten-4"
                  class="text-blue-darken-2 font-weight-bold rounded-sm">0</v-chip>
                <v-chip size="x-small" color="green-lighten-4"
                  class="text-green-darken-2 font-weight-bold rounded-sm">0</v-chip>
              </div>
              <v-btn v-if="!isSprintActive" type="button"
                class="text-none bg-grey-lighten-3 text-medium-emphasis font-weight-medium rounded" size="small"
                elevation="0" @click="isStartSprintDialogOpen = true" :disabled="sprintIssues.length === 0">Start
                sprint</v-btn>
              <v-btn v-else type="button"
                class="text-none bg-grey-lighten-3 text-medium-emphasis font-weight-medium rounded" size="small"
                elevation="0" @click="completeSprint">Complete sprint</v-btn>
              <v-btn icon="mdi-dots-horizontal" variant="text" size="small" class="text-medium-emphasis"></v-btn>
            </div>
          </div>

          <!-- Empty Sprint Box -->
          <v-card v-if="sprintIssues.length === 0" variant="outlined"
            class="border-dashed bg-grey-lighten-5 rounded d-flex flex-column align-center justify-center py-8 px-4"
            elevation="0">
            <div class="position-relative mb-2">
              <v-sheet width="60" height="40" class="bg-transparent d-flex align-center justify-center">
                <div class="d-flex">
                  <div
                    style="width: 24px; height: 24px; border-radius: 50%; background-color: #AB47BC; opacity: 0.8; margin-right: -10px;">
                  </div>
                  <div
                    style="width: 24px; height: 24px; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); background-color: #FFA000; opacity: 0.8; margin-right: -10px; margin-top: 10px;">
                  </div>
                  <div style="width: 24px; height: 24px; background-color: #66BB6A; opacity: 0.8; margin-top: 5px;">
                  </div>
                </div>
              </v-sheet>
            </div>
            <h3 class="text-subtitle-1 font-weight-bold mb-1">Plan your sprint</h3>
            <p class="text-body-2 text-medium-emphasis text-center max-w-500">
              Drag work items from the <span class="font-weight-bold">Backlog</span> section or create new
              ones to plan the work for this sprint. Select <span class="font-weight-bold">Start
                sprint</span> when you're ready.
            </p>
          </v-card>

          <!-- Sprint Items container -->
          <div v-else class="border rounded-sm overflow-hidden mb-1">
            <div v-for="issue in sprintIssues" :key="issue.id"
              class="d-flex align-center py-2 px-3 border-b issue-row hover-bg-grey">
              <!-- <v-checkbox-btn density="compact" color="primary" class="mr-2"></v-checkbox-btn> -->
              <v-sheet width="20" height="20" :color="getIssueIcon(issue.type).color"
                class="rounded-sm d-flex align-center justify-center mr-2">
                <v-icon size="14" color="white">{{ getIssueIcon(issue.type).icon }}</v-icon>
              </v-sheet>
              <span class="text-body-2 text-medium-emphasis mr-2" style="width: 45px;">{{ issue.key }}</span>
              <span class="text-body-2 flex-grow-1 cursor-pointer hover-underline">{{ issue.summary }}</span>

              <div class="d-flex align-center gap-3 status-controls">
                <v-btn variant="flat" size="small" color="grey-lighten-3"
                  class="text-none px-2 rounded-sm text-caption font-weight-bold text-grey-darken-2"
                  style="height: 24px;">
                  {{ issue.status }} <v-icon size="14" class="ml-1">mdi-chevron-down</v-icon>
                </v-btn>

                <v-chip size="x-small" color="transparent" variant="flat"
                  class="text-medium-emphasis px-1 bg-transparent hover-bg-grey"
                  style="min-width: 24px; justify-content: center;">-</v-chip>

                <v-avatar v-if="issue.assignees && issue.assignees.length > 0" :image="issue.assignees[0]?.avatar"
                  size="24" class="cursor-pointer"></v-avatar>
                <v-avatar v-else color="grey-lighten-2" size="24"
                  class="text-grey-darken-1 cursor-pointer d-flex align-center justify-center">
                  <v-icon size="16">mdi-account-outline</v-icon>
                </v-avatar>
              </div>
            </div>
          </div>

          <div v-if="isCreatingSprintIssue"
            class="create-issue-box rounded-xs d-flex align-center px-3 py-1 bg-white mt-1">
            <v-icon size="18" color="primary" class="mr-1">mdi-checkbox-marked-outline</v-icon>
            <v-icon size="16" color="medium-emphasis" class="mr-2">mdi-chevron-down</v-icon>

            <input type="text" v-model="newSprintIssueTitle" placeholder="Describe what needs to be done."
              class="flex-grow-1 text-body-2 outline-none py-1" autofocus @keyup.enter="createSprintIssue"
              @keydown.esc="isCreatingSprintIssue = false" />

            <div class="d-flex align-center gap-3">
              <v-icon size="18" color="medium-emphasis"
                class="cursor-pointer hover-text-primary">mdi-calendar-blank</v-icon>
              <v-icon size="18" color="medium-emphasis"
                class="cursor-pointer hover-text-primary">mdi-account-circle-outline</v-icon>

              <v-btn type="button" size="small" variant="flat" color="grey-lighten-1"
                class="text-none font-weight-medium px-2 text-medium-emphasis" @click="createSprintIssue">
                Create
                <v-icon end size="14">mdi-keyboard-return</v-icon>
              </v-btn>
            </div>
          </div>
          <v-btn v-else prepend-icon="mdi-plus" type="button"
            class="text-none bg-grey-lighten-3 text-medium-emphasis font-weight-medium rounded mt-2" size="small"
            @click="isCreatingSprintIssue = true">
            Create
          </v-btn>
        </div>

        <!-- Estimate Breakpoint -->
        <div class="d-flex align-center mb-6">
          <div class="flex-grow-1 border-t border-dashed"></div>
          <div class="px-3 d-flex align-center gap-1 cursor-pointer">
            <v-icon size="16" class="text-medium-emphasis">mdi-unfold-more-horizontal</v-icon>
          </div>
          <div class="flex-grow-1 border-t border-dashed"></div>
          <div class="ml-4 text-caption text-medium-emphasis d-flex gap-2">
            <span><span class="font-weight-bold">0</span> of <span class="font-weight-bold">0</span> work
              items visible</span>
            <span class="mx-1">|</span>
            <span>Estimate: <span class="font-weight-bold">0</span> of <span class="font-weight-bold">0</span></span>
          </div>
        </div>

        <!-- Backlog Section -->
        <div>
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center cursor-pointer">
              <v-icon size="20" class="mr-1 text-medium-emphasis">mdi-chevron-down</v-icon>
              <h2 class="text-subtitle-1 font-weight-bold mb-0">Backlog</h2>
              <span class="text-caption text-medium-emphasis ml-2">({{ backlogIssues.length }} work items)</span>
            </div>

            <div class="d-flex align-center gap-3">
              <div class="d-flex gap-1">
                <v-chip size="x-small" color="grey-lighten-2"
                  class="text-grey-darken-2 font-weight-bold rounded-sm">0</v-chip>
                <v-chip size="x-small" color="blue-lighten-4"
                  class="text-blue-darken-2 font-weight-bold rounded-sm">0</v-chip>
                <v-chip size="x-small" color="green-lighten-4"
                  class="text-green-darken-2 font-weight-bold rounded-sm">0</v-chip>
              </div>
              <v-btn class="text-none bg-grey-lighten-3 text-medium-emphasis font-weight-medium rounded" size="small"
                elevation="0">Create sprint</v-btn>
            </div>
          </div>

          <!-- Backlog Items container -->
          <div v-if="backlogIssues.length > 0" class="border rounded-sm overflow-hidden mb-1">
            <div v-for="issue in backlogIssues" :key="issue.id"
              class="d-flex align-center py-2 px-3 border-b issue-row hover-bg-grey">
              <!-- <v-checkbox-btn density="compact" color="primary" class="mr-2"></v-checkbox-btn> -->
              <v-sheet width="20" height="20" :color="getIssueIcon(issue.type).color"
                class="rounded-sm d-flex align-center justify-center mr-2">
                <v-icon size="14" color="white">{{ getIssueIcon(issue.type).icon }}</v-icon>
              </v-sheet>
              <span class="text-body-2 text-medium-emphasis mr-2" style="width: 45px;">{{ issue.key }}</span>
              <span class="text-body-2 flex-grow-1 cursor-pointer hover-underline">{{ issue.summary }}</span>

              <div class="d-flex align-center gap-3 status-controls">
                <v-btn variant="flat" size="small" color="grey-lighten-3"
                  class="text-none px-2 rounded-sm text-caption font-weight-bold text-grey-darken-2"
                  style="height: 24px;">
                  {{ issue.status === 'TODO' ? 'TO DO' : issue.status }} <v-icon size="14"
                    class="ml-1">mdi-chevron-down</v-icon>
                </v-btn>

                <v-chip size="x-small" color="transparent" variant="flat"
                  class="text-medium-emphasis px-1 bg-transparent hover-bg-grey"
                  style="min-width: 24px; justify-content: center;">-</v-chip>

                <v-avatar v-if="issue.assignees && issue.assignees.length > 0" :image="issue.assignees[0]?.avatar"
                  size="24" class="cursor-pointer"></v-avatar>
                <v-avatar v-else color="grey-lighten-2" size="24"
                  class="text-grey-darken-1 cursor-pointer d-flex align-center justify-center">
                  <v-icon size="16">mdi-account-outline</v-icon>
                </v-avatar>
              </div>
            </div>
          </div>

          <div v-if="isCreatingBacklogIssue"
            class="create-issue-box rounded-xs d-flex align-center px-3 py-1 bg-white mt-1">
            <v-icon size="18" color="primary" class="mr-1">mdi-checkbox-marked-outline</v-icon>
            <v-icon size="16" color="medium-emphasis" class="mr-2">mdi-chevron-down</v-icon>

            <input type="text" v-model="newBacklogIssueTitle" placeholder="Describe what needs to be done."
              class="flex-grow-1 text-body-2 outline-none py-1" autofocus @keyup.enter="createBacklogIssue"
              @keydown.esc="isCreatingBacklogIssue = false" />

            <div class="d-flex align-center gap-3">
              <v-icon size="18" color="medium-emphasis"
                class="cursor-pointer hover-text-primary">mdi-calendar-blank</v-icon>
              <v-icon size="18" color="medium-emphasis"
                class="cursor-pointer hover-text-primary">mdi-account-circle-outline</v-icon>

              <v-btn size="small" variant="flat" color="grey-lighten-1"
                class="text-none font-weight-medium px-2 text-medium-emphasis" @click="createBacklogIssue">
                Create
                <v-icon end size="14">mdi-keyboard-return</v-icon>
              </v-btn>
            </div>
          </div>
          <!-- <v-btn class="text-none bg-grey-lighten-3 text-medium-emphasis font-weight-medium rounded" size="small"
                elevation="0">Create sprint</v-btn> -->
          <v-btn v-else prepend-icon="mdi-plus" elevation="0"
            class="text-none bg-grey-lighten-3 text-medium-emphasis font-weight-medium rounded mt-1" size="small"
            @click="isCreatingBacklogIssue = true">
            Create
          </v-btn>

        </div>

      </div>
    </div>

    <!-- Start Sprint Dialog -->
    <v-dialog v-model="isStartSprintDialogOpen" max-width="600" scroll-strategy="none">
      <v-card class="rounded-md">
        <v-card-title class="d-flex align-center justify-space-between pa-6 pb-2">
          <span class="text-h5 font-weight-bold">Start another sprint</span>
          <v-btn icon="mdi-close" variant="text" density="comfortable" size="small"
            @click="isStartSprintDialogOpen = false"></v-btn>
        </v-card-title>

        <v-card-text class="px-6 pb-6 pt-2" style="overflow-y: auto; max-height: 80vh;">
          <p class="text-body-1 font-weight-medium mb-4"><span class="font-weight-bold">{{ sprintIssues.length
              }}</span> work item will be included in this sprint.</p>
          <p class="text-caption text-medium-emphasis mb-4">Required fields are marked with an asterisk <span
              class="text-error">*</span></p>

          <v-form @submit.prevent>
            <div class="mb-4">
              <label class="text-body-2 font-weight-medium d-block mb-1">Sprint name <span
                  class="text-error">*</span></label>
              <v-text-field v-model="sprintDetails.name" variant="outlined" density="compact" hide-details
                bg-color="white"></v-text-field>
            </div>

            <div class="mb-4">
              <label class="text-body-2 font-weight-medium d-block mb-1">Duration <span
                  class="text-error">*</span></label>
              <v-select v-model="sprintDetails.duration" :items="['custom', '1 week', '2 weeks', '3 weeks', '4 weeks']"
                variant="outlined" density="compact" hide-details bg-color="white"></v-select>
            </div>

            <div class="mb-1">
              <label class="text-body-2 font-weight-medium d-block mb-1">Start date <span
                  class="text-error">*</span></label>
              <v-text-field v-model="sprintDetails.startDate" type="datetime-local" variant="outlined" density="compact"
                hide-details bg-color="white" clearable></v-text-field>
            </div>

            <div class="mb-4">
              <p class="text-caption text-medium-emphasis line-height-1 mb-0 mt-1">
                Planned start date: <span class="font-weight-bold">24/01/2026, 17:36</span>
              </p>
              <p class="text-caption text-medium-emphasis line-height-1">
                A sprint's start date impacts velocity and scope in reports. <a href="#"
                  class="text-primary text-decoration-none">Learn more. <v-icon
                    size="small">mdi-open-in-new</v-icon></a>
              </p>
            </div>

            <div class="mb-4">
              <label class="text-body-2 font-weight-medium d-block mb-1">End date <span
                  class="text-error">*</span></label>
              <v-text-field v-model="sprintDetails.endDate" type="datetime-local" variant="outlined" density="compact"
                hide-details bg-color="white" clearable></v-text-field>
            </div>

            <div class="mb-4">
              <label class="text-body-2 font-weight-medium d-block mb-1">Sprint goal</label>
              <v-textarea v-model="sprintDetails.goal" variant="outlined" density="comfortable" rows="4" auto-grow
                hide-details bg-color="white"></v-textarea>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 bg-white justify-end">
          <v-btn variant="text" class="text-none font-weight-medium text-medium-emphasis mr-2"
            @click="isStartSprintDialogOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6"
            @click="startSprint">Start</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Complete Sprint Dialog -->
    <v-dialog v-model="isCompleteSprintDialogOpen" max-width="500" scroll-strategy="none">
      <v-card class="rounded-lg overflow-hidden">
        <!-- Header Image area (CSS approximation of the wave/medal) -->
        <div class="position-relative bg-blue-lighten-1" style="height: 120px; overflow: hidden;">
          <svg viewBox="0 0 1440 320" style="position: absolute; bottom: 0; width: 100%; height: auto;">
            <path fill="#03A9F4" fill-opacity="1"
              d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,160C672,139,768,117,864,122.7C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
          </svg>
          <svg viewBox="0 0 1440 320" style="position: absolute; bottom: 0; width: 100%; height: auto; opacity: 0.5;">
            <path fill="#00BCD4" fill-opacity="1"
              d="M0,256L60,245.3C120,235,240,213,360,213.3C480,213,600,235,720,229.3C840,224,960,192,1080,186.7C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z">
            </path>
          </svg>

          <!-- Badge Icon -->
          <div class="position-absolute d-flex justify-center w-100" style="bottom: -20px;">
            <svg width="80" height="80" viewBox="0 0 100 100">
              <path d="M35 50 L20 100 L50 80 Z" fill="#0277bd" />
              <path d="M65 50 L80 100 L50 80 Z" fill="#0091ea" />
              <circle cx="50" cy="40" r="30" fill="#ffb300" />
              <circle cx="50" cy="40" r="23" fill="#ffca28" />
              <path d="M50 25 L54 34 L64 34 L56 40 L59 50 L50 44 L41 50 L44 40 L36 34 L46 34 Z" fill="#1565c0" />
            </svg>
          </div>
        </div>

        <v-card-title class="px-6 pt-10 pb-4 text-h5 font-weight-bold">
          Complete {{ sprintDetails.name || 'Sprint 1' }}
        </v-card-title>

        <v-card-text class="px-6 py-2">
          <p class="text-body-1 mb-4 text-grey-darken-3">
            This sprint contains <span class="font-weight-bold">{{ completedSprintIssuesCount }} completed work item{{
              completedSprintIssuesCount !== 1 ? 's' : '' }}</span>
            and <span class="font-weight-bold">{{ openSprintIssuesCount }} open work item{{ openSprintIssuesCount !== 1
              ? 's' : '' }}</span>.
          </p>

          <ul class="ml-6 mb-6 text-body-2 text-grey-darken-3" style="list-style-type: disc;">
            <li class="mb-2">Completed work items includes everything in the last column on the board, test.</li>
            <li>Open work items includes everything from any other column on the board. Move these to a new sprint or
              the backlog.</li>
          </ul>

          <div class="mb-4">
            <label class="text-subtitle-2 font-weight-bold d-block mb-1">Move open work items to</label>
            <v-select v-model="moveToDestination" :items="['EX Sprint 2', 'Backlog']" variant="outlined"
              density="compact" hide-details bg-color="white"></v-select>
          </div>

          <v-sheet class="bg-grey-lighten-4 pa-4 rounded mt-4 d-flex align-start gap-3">
            <v-checkbox-btn v-model="createRetrospective" color="primary" class="mt-0 pt-0"
              hide-details></v-checkbox-btn>
            <div>
              <div class="font-weight-bold text-body-2 mb-1" style="color: #172B4D;">Create a retrospective for this
                sprint</div>
              <div class="text-body-2 text-medium-emphasis line-height-1">
                Finish off your sprint with a Confluence retrospective! Contribute to your team's culture and improve
                how you work.
              </div>
            </div>
          </v-sheet>
        </v-card-text>

        <v-card-actions class="pa-6 pt-6 d-flex justify-end bg-white">
          <v-btn variant="text" class="text-none font-weight-medium text-medium-emphasis mr-2"
            @click="isCompleteSprintDialogOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-4"
            @click="confirmCompleteSprint">Complete sprint</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import ProjectHeader from '@/components/ProjectHeader.vue'

const taskStore = useTaskStore()

const sprintIssues = computed(() => taskStore.issues.filter(i => i.sprintId === 'sprint-1'))
const backlogIssues = computed(() => taskStore.issues.filter(i => !i.sprintId))

const isCreatingSprintIssue = ref(false)
const newSprintIssueTitle = ref('')

const isCreatingBacklogIssue = ref(false)
const newBacklogIssueTitle = ref('')

const isStartSprintDialogOpen = ref(false)
const isSprintActive = ref(false)
const isCompleteSprintDialogOpen = ref(false)
const moveToDestination = ref('EX Sprint 2')
const createRetrospective = ref(true)

const sprintDetails = ref({
  name: 'EX Sprint 1',
  duration: 'custom',
  startDate: '', // Will be populated in startSprint dialogue or pre-filled
  endDate: '',
  goal: ''
})

const completedSprintIssuesCount = computed(() => sprintIssues.value.filter(i => i.status === 'DONE').length)
const openSprintIssuesCount = computed(() => sprintIssues.value.filter(i => i.status !== 'DONE').length)

const formatSprintDates = (start: string, end: string) => {
  if (!start || !end) return '';
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startStr = startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const endStr = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${startStr} - ${endStr}`;
}

const startSprint = () => {
  isSprintActive.value = true
  isStartSprintDialogOpen.value = false
}

const completeSprint = () => {
  isCompleteSprintDialogOpen.value = true
}

const confirmCompleteSprint = () => {
  isSprintActive.value = false
  isCompleteSprintDialogOpen.value = false
  sprintDetails.value = {
    name: 'EX Sprint 2',
    duration: 'custom',
    startDate: '',
    endDate: '',
    goal: ''
  }
}

const getIssueIcon = (type: string) => {
  switch (type) {
    case 'Task': return { icon: 'mdi-check-bold', color: 'blue' }
    case 'Bug': return { icon: 'mdi-circle', color: 'red' }
    case 'Story': return { icon: 'mdi-bookmark', color: 'green' }
    case 'Epic': return { icon: 'mdi-lightning-bolt', color: 'purple' }
    default: return { icon: 'mdi-check-bold', color: 'blue' }
  }
}

const createSprintIssue = () => {
  if (!newSprintIssueTitle.value.trim()) return
  taskStore.createIssue({
    summary: newSprintIssueTitle.value,
    status: 'TODO',
    priority: 'Medium',
    assignees: [],
    type: 'Task',
    sprintId: 'sprint-1'
  })
  newSprintIssueTitle.value = ''
  isCreatingSprintIssue.value = false
}

const createBacklogIssue = () => {
  if (!newBacklogIssueTitle.value.trim()) return
  taskStore.createIssue({
    summary: newBacklogIssueTitle.value,
    status: 'TODO',
    priority: 'Medium',
    assignees: [],
    type: 'Task'
  })
  newBacklogIssueTitle.value = ''
  isCreatingBacklogIssue.value = false
}
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

.border-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.border-dashed {
  border: 2px dashed rgba(0, 0, 0, 0.12);
}

.max-w-1000 {
  max-width: 1000px;
}

.max-w-500 {
  max-width: 500px;
}

:deep(.v-btn--active) {
  color: var(--v-theme-primary);
}

.custom-search :deep(.v-field__input) {
  min-height: 32px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.custom-search :deep(.v-field__outline) {
  --v-field-border-opacity: 0.12;
}

.hover-bg-grey:hover {
  background-color: #f4f5f7;
}

.hover-underline:hover {
  text-decoration: underline;
}

.issue-row {
  transition: background-color 0.2s;
}

.status-controls {
  opacity: 0.8;
  transition: opacity 0.2s;
}

.issue-row:hover .status-controls {
  opacity: 1;
}

.create-issue-box {
  border: 1px solid rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgb(var(--v-theme-primary));
}

.outline-none {
  outline: none;
}

.outline-none::placeholder {
  color: #9e9e9e;
}

.hover-text-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
