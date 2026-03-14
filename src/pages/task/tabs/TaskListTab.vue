<template>
  <div class="h-100 overflow-y-auto">
    <div class="px-6 pb-6">
      <v-card elevation="0" border class="overflow-hidden">
        <v-table class="tasks-table">
          <thead>
            <tr>
              <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:40%">Name</th>
              <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:15%">Due date</th>
              <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:20%">Collaborators</th>
              <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:15%">Projects</th>
              <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:10%">Visibility</th>
            </tr>
          </thead>
          <tbody>
            <tr class="group-header">
              <td colspan="5" class="pa-0">
                <div class="d-flex align-center px-4 py-2 cursor-pointer hover-bg-grey">
                  <v-icon size="18" class="mr-2">mdi-menu-down</v-icon>
                  <span class="font-weight-bold text-body-2">Recently assigned</span>
                </div>
              </td>
            </tr>
            <tr v-for="task in listTasks" :key="task.id" class="task-row cursor-pointer">
              <td class="pl-8 py-2">
                <div class="d-flex align-center">
                  <v-icon size="16" class="mr-2 text-medium-emphasis">mdi-check-circle-outline</v-icon>
                  <span class="text-body-2 font-weight-medium">{{ task.name }}</span>
                  <span v-if="task.comments" class="d-flex align-center ml-2 text-medium-emphasis">
                    <span class="text-caption mr-1">{{ task.comments }}</span>
                    <v-icon size="13">mdi-message-outline</v-icon>
                  </span>
                </div>
              </td>
              <td class="text-body-2 text-medium-emphasis">{{ task.due }}</td>
              <td class="py-2">
                <div class="d-flex">
                  <v-avatar v-for="(a, i) in task.assignees" :key="i" size="22"
                    :color="a.color" class="avatar-stack"
                    style="border:2px solid white">
                    <v-img v-if="a.img" :src="a.img" cover />
                    <span v-else class="text-caption font-weight-bold" style="font-size:9px">{{ a.initials }}</span>
                  </v-avatar>
                </div>
              </td>
              <td></td>
              <td class="text-caption text-medium-emphasis">
                <v-icon size="14" class="mr-1">mdi-account-multiple-outline</v-icon>Collaborators
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
const listTasks = [
  {
    id: 1, name: 'Partner library task updates', due: '29 Jan', comments: 2,
    assignees: [
      { img: 'https://i.pravatar.cc/150?img=11', color: '' },
      { initials: 'PR', color: 'pink-lighten-3' },
    ],
  },
  {
    id: 2, name: 'Mutual Fund - Backoffice', due: '', comments: 0,
    assignees: [
      { initials: 'AP', color: 'orange-lighten-2' },
      { initials: 'SM', color: 'amber-lighten-2' },
      { initials: 'RR', color: 'yellow-lighten-2' },
      { initials: 'UP', color: 'deep-purple-lighten-4' },
    ],
  },
  {
    id: 3, name: 'Performance Dashboard Requirement and Implementation', due: 'Friday', comments: 16,
    assignees: [
      { initials: 'Ma', color: 'pink-lighten-4' },
      { initials: 'Ha', color: 'cyan-lighten-4' },
      { initials: 'RR', color: 'deep-purple-lighten-4' },
    ],
  },
]
</script>

<style scoped>
.tasks-table th {
  border-bottom: 1px solid #f0f0f0 !important;
  background: transparent !important;
  padding: 8px 16px !important;
}
.tasks-table td {
  border-bottom: 1px solid #f0f0f0 !important;
}
.task-row:hover td {
  background-color: #f8f9fa !important;
}
.avatar-stack {
  margin-right: -6px;
}
.avatar-stack:last-child { margin-right: 0; }
</style>
