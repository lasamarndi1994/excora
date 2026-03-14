<template>
    <v-dialog :model-value="modelValue" @update:model-value="onUpdateModelValue" max-width="600" scrollable scroll-strategy="none">
        <v-card class="rounded-lg">
            <v-card-title class="d-flex justify-space-between align-center px-6 py-4 border-b">
                <span class="text-h6 font-weight-bold">Edit Decision</span>
                <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)"></v-btn>
            </v-card-title>

            <v-card-text class="px-6 py-6" style="max-height: 70vh;">
                <form @submit.prevent="save">
                    <div class="mb-4">
                        <label class="font-weight-medium text-subtitle-2 d-flex align-center gap-1 mb-1">Decision Title
                            <span class="text-error">*</span></label>
                        <v-text-field v-model="formData.title" variant="outlined" density="comfortable"
                            placeholder="What decision needs to be made?" :error-messages="errors.title"></v-text-field>
                    </div>

                    <div class="mb-4">
                        <label class="font-weight-medium text-subtitle-2 d-flex align-center gap-1 mb-1">Reason <span
                                class="text-error">*</span></label>
                        <v-textarea v-model="formData.reason" variant="outlined" density="comfortable" rows="3"
                            placeholder="Why is this decision needed?" :error-messages="errors.reason"></v-textarea>
                    </div>

                    <div class="mb-4">
                        <label class="font-weight-medium text-subtitle-2 d-flex align-center gap-1 mb-1">Impact <span
                                class="text-error">*</span></label>
                        <v-radio-group v-model="formData.impact" inline hide-details class="mt-0">
                            <v-radio value="High" color="error">
                                <template v-slot:label><v-chip size="x-small" color="error" variant="flat"
                                        class="font-weight-bold text-white ml-1">High</v-chip></template>
                            </v-radio>
                            <v-radio value="Medium" color="warning">
                                <template v-slot:label><v-chip size="x-small" color="warning" variant="flat"
                                        class="font-weight-bold text-white ml-1">Medium</v-chip></template>
                            </v-radio>
                            <v-radio value="Low" color="success">
                                <template v-slot:label><v-chip size="x-small" color="success" variant="flat"
                                        class="font-weight-bold text-white ml-1">Low</v-chip></template>
                            </v-radio>
                        </v-radio-group>
                    </div>

                    <div class="mb-4">
                        <label class="font-weight-medium text-subtitle-2 d-flex align-center gap-1 mb-1">Linked Work
                            Item <span class="text-error">*</span></label>
                        <v-combobox v-model="formData.linkedWork" :items="issues.map(i => `${i.key} ${i.summary}`)"
                            variant="outlined" density="comfortable" placeholder="Select task or sprint...">
                            <template v-slot:prepend-inner>
                                <v-avatar size="20" class="mr-1"><v-img :src="currentUser?.avatar"></v-img></v-avatar>
                            </template>
                        </v-combobox>
                    </div>

                    <div class="mb-4">
                        <label class="font-weight-medium text-subtitle-2 mb-1 d-block text-high-emphasis">Options
                            Considered <span class="text-medium-emphasis font-weight-regular">(optional)</span></label>
                        <v-textarea v-model="formData.optionsConsidered" variant="outlined" density="comfortable"
                            rows="3" placeholder="List options if applicable"></v-textarea>
                    </div>

                    <div class="mb-2">
                        <label class="font-weight-medium text-subtitle-2 mb-1 d-block text-high-emphasis">Decision Made
                            <span class="text-medium-emphasis font-weight-regular">(optional)</span></label>
                        <v-textarea v-model="formData.decisionMade" variant="outlined" density="comfortable" rows="3"
                            placeholder="Describe the decision outcome"></v-textarea>
                    </div>
                </form>
            </v-card-text>

            <v-card-actions class="px-6 py-4 border-t d-flex justify-end gap-3 bg-grey-lighten-5">
                <v-btn variant="outlined" class="text-none border-grey-lighten-1 font-weight-medium"
                    @click="$emit('update:modelValue', false)">Cancel</v-btn>
                <v-btn color="primary" variant="flat" class="text-none px-6 font-weight-medium" @click="save">Save
                    Decision</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Issue, User, Decision } from '@/stores/taskStore'

const props = defineProps<{
    modelValue: boolean
    decision: Decision | null
    issues: Issue[]
    currentUser: User | null
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', id: string, data: Partial<Decision>): void
}>()

const formData = ref<Partial<Decision>>({})
const errors = ref({ title: '', reason: '' })

watch(() => props.decision, (newDecision) => {
    if (newDecision) {
        formData.value = { ...newDecision }
        errors.value = { title: '', reason: '' }
    } else {
        formData.value = {}
    }
}, { immediate: true })

const onUpdateModelValue = (val: boolean) => {
    emit('update:modelValue', val)
}

const save = () => {
    if (!props.decision) return

    let isValid = true
    errors.value = { title: '', reason: '' }

    if (!formData.value.title?.trim()) {
        errors.value.title = 'Decision Title is required.'
        isValid = false
    }
    if (!formData.value.reason?.trim()) {
        errors.value.reason = 'Reason is required.'
        isValid = false
    }

    if (!isValid) return

    const payload = { ...formData.value }

    emit('save', props.decision.id, payload)
}
</script>

<style scoped>
.gap-1 {
    gap: 4px;
}

.gap-3 {
    gap: 12px;
}
</style>
