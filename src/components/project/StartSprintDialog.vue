<template>
    <v-dialog v-model="internalValue" max-width="600" scroll-strategy="none">
        <v-card class="rounded-md">
            <v-card-title class="d-flex align-center justify-space-between pa-6 pb-2">
                <span class="text-h5 font-weight-bold">Start another sprint</span>
                <v-btn icon="mdi-close" variant="text" density="comfortable" size="small"
                    @click="internalValue = false"></v-btn>
            </v-card-title>

            <v-card-text class="px-6 pb-6 pt-2" style="overflow-y: auto; max-height: 80vh;">
                <p class="text-body-1 font-weight-medium mb-4"><span class="font-weight-bold">{{ sprintIssuesCount
                        }}</span> work item{{ sprintIssuesCount === 1 ? '' : 's' }} will be included in this sprint.</p>
                <p class="text-caption text-medium-emphasis mb-4">Required fields are marked with an asterisk <span
                        class="text-error">*</span></p>

                <v-form @submit.prevent>
                    <div class="mb-4">
                        <label class="text-body-2 font-weight-medium d-block mb-1">Sprint name <span
                                class="text-error">*</span></label>
                        <v-text-field v-model="sprintDetailsRef.name" variant="outlined" density="compact" hide-details
                            bg-color="white"></v-text-field>
                    </div>

                    <div class="mb-4">
                        <label class="text-body-2 font-weight-medium d-block mb-1">Duration <span
                                class="text-error">*</span></label>
                        <v-select v-model="sprintDetailsRef.duration"
                            :items="['custom', '1 week', '2 weeks', '3 weeks', '4 weeks']" variant="outlined"
                            density="compact" hide-details bg-color="white"></v-select>
                    </div>

                    <div class="mb-1">
                        <label class="text-body-2 font-weight-medium d-block mb-1">Start date <span
                                class="text-error">*</span></label>
                        <v-text-field v-model="sprintDetailsRef.startDate" type="datetime-local" variant="outlined"
                            density="compact" hide-details bg-color="white" clearable></v-text-field>
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
                        <v-text-field v-model="sprintDetailsRef.endDate" type="datetime-local" variant="outlined"
                            density="compact" hide-details bg-color="white" clearable></v-text-field>
                    </div>

                    <div class="mb-4">
                        <label class="text-body-2 font-weight-medium d-block mb-1">Sprint goal</label>
                        <v-textarea v-model="sprintDetailsRef.goal" variant="outlined" density="comfortable" rows="4"
                            auto-grow hide-details bg-color="white"></v-textarea>
                    </div>
                </v-form>
            </v-card-text>

            <v-card-actions class="pa-4 bg-white justify-end">
                <v-btn variant="text" class="text-none font-weight-medium text-medium-emphasis mr-2"
                    @click="internalValue = false">Cancel</v-btn>
                <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6"
                    @click="start">Start</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    sprintIssuesCount: { type: Number, required: true },
    sprintDetails: { type: Object, required: true }
})

const emit = defineEmits(['update:modelValue', 'update:sprintDetails', 'start'])

const internalValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const sprintDetailsRef = computed({
    get: () => props.sprintDetails,
    set: (val) => emit('update:sprintDetails', val)
})

const start = () => {
    emit('start')
    internalValue.value = false
}
</script>

<style scoped>
.line-height-1 {
    line-height: 1.2;
}
</style>
