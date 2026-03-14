<template>
    <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="400" scroll-strategy="none">
        <v-card class="rounded-lg pa-4 text-center">
            <v-icon icon="mdi-alert-circle-outline" color="error" size="48" class="mb-4 mt-2"></v-icon>
            <h3 class="text-h6 font-weight-bold mb-2">Delete Sprint?</h3>
            <p class="text-body-2 text-medium-emphasis mb-6">Are you sure you want to delete <strong>{{ sprint?.name
                    }}</strong>? This action cannot be undone.</p>
            <div class="d-flex gap-4 justify-center">
                <v-btn variant="outlined" color="medium-emphasis" class="text-none flex-grow-1"
                    @click="$emit('update:modelValue', false)">Cancel</v-btn>
                <v-btn color="error" variant="flat" class="text-none flex-grow-1" @click="confirm">Delete</v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import type { Sprint } from '@/stores/taskStore'

const props = defineProps<{
    modelValue: boolean
    sprint: Sprint | null
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm', id: string): void
}>()

const confirm = () => {
    if (props.sprint) {
        emit('confirm', props.sprint.id)
    }
}
</script>
