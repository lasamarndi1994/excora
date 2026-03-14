<template>
    <v-container fluid class="h-100 pa-6">
        <div class="d-flex align-center mb-6">
            <h1 class="text-h5 font-weight-bold">Issues</h1>
            <v-spacer></v-spacer>
        </div>

        <v-card variant="outlined" class="rounded-lg">
            <v-data-table :headers="headers" :items="store.issues" item-value="id" class="text-body-2" density="compact"
                hide-default-footer>
                <template v-slot:item.type="{ item }">
                    <v-icon v-if="item.type === 'Bug'" color="red" size="18" icon="mdi-alert-circle"></v-icon>
                    <v-icon v-else-if="item.type === 'Story'" color="green" size="18" icon="mdi-bookmark"></v-icon>
                    <v-icon v-else color="blue" size="18" icon="mdi-check-bold"></v-icon>
                </template>

                <template v-slot:item.key="{ item }">
                    <span class="text-caption font-weight-bold text-medium-emphasis">{{ item.key }}</span>
                </template>

                <template v-slot:item.summary="{ item }">
                    <span class="font-weight-medium text-high-emphasis">{{ item.summary }}</span>
                </template>

                <template v-slot:item.assignee="{ item }">
                    <div class="d-flex align-center">
                        <div class="d-flex mr-2">
                            <v-avatar v-for="(assignee, i) in item.assignees" :key="assignee.id" size="20"
                                :class="{ 'ml-n1': i > 0 }" style="border: 1px solid rgb(var(--v-theme-surface))">
                                <v-img :src="assignee.avatar"></v-img>
                                <v-tooltip activator="parent" location="top">{{ assignee.name }}</v-tooltip>
                            </v-avatar>
                        </div>
                        <span class="text-caption text-truncate" style="max-width: 150px">
                            {{item.assignees.map(a => a.name).join(', ')}}
                        </span>
                    </div>
                </template>

                <template v-slot:item.priority="{ item }">
                    <div class="d-flex align-center">
                        <v-icon v-if="item.priority === 'High'" color="red" size="16" icon="mdi-chevron-double-up"
                            class="mr-1"></v-icon>
                        <v-icon v-else-if="item.priority === 'Medium'" color="orange" size="16" icon="mdi-chevron-up"
                            class="mr-1"></v-icon>
                        <v-icon v-else color="blue" size="16" icon="mdi-chevron-down" class="mr-1"></v-icon>
                        {{ item.priority }}
                    </div>
                </template>

                <template v-slot:item.status="{ item }">
                    <v-chip size="x-small" variant="flat" :color="getStatusColor(item.status)"
                        class="font-weight-bold text-uppercase">
                        {{ item.status.replace('_', ' ') }}
                    </v-chip>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()

const headers = [
    { title: 'Type', key: 'type', width: '50px', sortable: false },
    { title: 'Key', key: 'key', width: '100px' },
    { title: 'Summary', key: 'summary' },
    { title: 'Assignee', key: 'assignee' },
    { title: 'Status', key: 'status' },
    { title: 'Priority', key: 'priority' },
    { title: 'Due Date', key: 'dueDate' }, // Add mocked due date if possible
]

const getStatusColor = (status: string) => {
    switch (status) {
        case 'TODO': return 'secondary'
        case 'IN_PROGRESS': return 'info'
        case 'DONE': return 'success'
        default: return 'grey'
    }
}
</script>
