<template>
    <v-dialog v-model="internalValue" max-width="500" scroll-strategy="none">
        <v-card class="rounded-lg overflow-hidden">
            <!-- Header Image area (CSS approximation of the wave/medal) -->
            <div class="position-relative bg-blue-lighten-1" style="height: 120px; overflow: hidden;">
                <svg viewBox="0 0 1440 320" style="position: absolute; bottom: 0; width: 100%; height: auto;">
                    <path fill="#03A9F4" fill-opacity="1"
                        d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,160C672,139,768,117,864,122.7C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                    </path>
                </svg>
                <svg viewBox="0 0 1440 320"
                    style="position: absolute; bottom: 0; width: 100%; height: auto; opacity: 0.5;">
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
                        <path d="M50 25 L54 34 L64 34 L56 40 L59 50 L50 44 L41 50 L44 40 L36 34 L46 34 Z"
                            fill="#1565c0" />
                    </svg>
                </div>
            </div>

            <v-card-title class="px-6 pt-10 pb-4 text-h5 font-weight-bold">
                Complete {{ sprintName || 'Sprint 1' }}
            </v-card-title>

            <v-card-text class="px-6 py-2">
                <p class="text-body-1 mb-4 text-grey-darken-3">
                    This sprint contains <span class="font-weight-bold">{{ completedCount }} completed work item{{
                        completedCount !== 1 ? 's' : '' }}</span>
                    and <span class="font-weight-bold">{{ openCount }} open work item{{ openCount !== 1 ? 's' : ''
                        }}</span>.
                </p>

                <ul class="ml-6 mb-6 text-body-2 text-grey-darken-3" style="list-style-type: disc;">
                    <li class="mb-2">Completed work items includes everything in the last column on the board, test.
                    </li>
                    <li>Open work items includes everything from any other column on the board. Move these to a new
                        sprint or the backlog.</li>
                </ul>

                <div class="mb-4">
                    <label class="text-subtitle-2 font-weight-bold d-block mb-1">Move open work items to</label>
                    <v-select v-model="moveToDestinationRef" :items="['EX Sprint 2', 'Backlog']" variant="outlined"
                        density="compact" hide-details bg-color="white"></v-select>
                </div>

                <v-sheet class="bg-grey-lighten-4 pa-4 rounded mt-4 d-flex align-start gap-3">
                    <v-checkbox-btn v-model="createRetrospectiveRef" color="primary" class="mt-0 pt-0"
                        hide-details></v-checkbox-btn>
                    <div>
                        <div class="font-weight-bold text-body-2 mb-1" style="color: #172B4D;">Create a retrospective
                            for this sprint</div>
                        <div class="text-body-2 text-medium-emphasis line-height-1">
                            Finish off your sprint with a Confluence retrospective! Contribute to your team's culture
                            and improve how you work.
                        </div>
                    </div>
                </v-sheet>
            </v-card-text>

            <v-card-actions class="pa-6 pt-6 d-flex justify-end bg-white">
                <v-btn variant="text" class="text-none font-weight-medium text-medium-emphasis mr-2"
                    @click="internalValue = false">Cancel</v-btn>
                <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-4"
                    @click="confirm">Complete sprint</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    sprintName: { type: String, required: true },
    completedCount: { type: Number, required: true },
    openCount: { type: Number, required: true },
    moveToDestination: { type: String, required: true },
    createRetrospective: { type: Boolean, required: true }
})

const emit = defineEmits(['update:modelValue', 'update:moveToDestination', 'update:createRetrospective', 'confirm'])

const internalValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const moveToDestinationRef = computed({
    get: () => props.moveToDestination,
    set: (val) => emit('update:moveToDestination', val)
})

const createRetrospectiveRef = computed({
    get: () => props.createRetrospective,
    set: (val) => emit('update:createRetrospective', val)
})

const confirm = () => {
    emit('confirm')
    internalValue.value = false
}
</script>

<style scoped>
.line-height-1 {
    line-height: 1.2;
}
</style>
