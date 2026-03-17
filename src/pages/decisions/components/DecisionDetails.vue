<template>
  <div class="detail-root">
    <!-- Sub-header -->
    <div class="detail-bar">
      <div class="detail-bar-left">
        <button class="back-btn" @click="$emit('close')">
          <v-icon size="15">mdi-arrow-left</v-icon>
        </button>
        <span class="detail-bar-title">Decision Detail</span>
        <span class="dec-id-badge">{{ decision.id }}</span>
      </div>
      <div class="detail-bar-right">
        <span class="status-chip" :class="decision.status === 'Approved' ? 'status-approved' : 'status-pending'">
          {{ decision.status }}
        </span>
        <button class="hdr-btn"><v-icon size="13">mdi-printer-outline</v-icon> Print</button>
        <button class="hdr-btn"><v-icon size="13">mdi-download-outline</v-icon> PDF</button>
        <button class="hdr-btn hdr-btn--primary" @click="$emit('close')">Close</button>
      </div>
    </div>

    <!-- Content -->
    <div class="detail-body">
      <div class="detail-card">

        <!-- Title section -->
        <div class="dc-title-section">
          <div class="dc-icon"><v-icon size="22" color="#4f46e5">mdi-clipboard-check-outline</v-icon></div>
          <div>
            <h2 class="dc-main-title">{{ decision.title }}</h2>
            <div class="dc-meta-row">
              <span class="dc-meta-item"><v-icon size="12">mdi-calendar-outline</v-icon> {{ decision.date }}</span>
              <span class="dc-meta-sep">·</span>
              <span class="dc-meta-item"><v-icon size="12">mdi-account-outline</v-icon> {{ decision.createdBy.name }}</span>
              <span class="dc-meta-sep">·</span>
              <span class="impact-chip" :class="`impact-${decision.impact.toLowerCase()}`">{{ decision.impact }} Impact</span>
            </div>
          </div>
        </div>

        <div class="dc-divider"></div>

        <!-- Info grid -->
        <div class="dc-grid">
          <div class="dc-section">
            <div class="dc-section-title">Reason</div>
            <div class="dc-section-body">{{ decision.reason }}</div>
          </div>

          <div class="dc-section">
            <div class="dc-section-title">Linked Work</div>
            <div class="dc-section-body">
              <a href="#" class="dc-link">{{ decision.linkedWork || '—' }}</a>
            </div>
          </div>

          <div v-if="decision.decisionMade" class="dc-section dc-section--full">
            <div class="dc-section-title">Decision Made</div>
            <div class="dc-section-body dc-preformat">{{ decision.decisionMade }}</div>
          </div>

          <div v-if="decision.optionsConsidered" class="dc-section dc-section--full">
            <div class="dc-section-title">Options Considered</div>
            <div class="dc-section-body dc-preformat">{{ decision.optionsConsidered }}</div>
          </div>
        </div>

        <!-- Status timeline -->
        <div class="dc-divider"></div>
        <div class="dc-timeline">
          <div class="dc-section-title" style="margin-bottom:12px">Status Timeline</div>
          <div class="timeline-steps">
            <div v-for="(step, i) in timelineSteps" :key="step.label"
              class="ts-step" :class="{ 'ts-done': step.done, 'ts-active': step.active }">
              <div class="ts-dot">
                <v-icon v-if="step.done" size="12" color="white">mdi-check</v-icon>
              </div>
              <div v-if="i < timelineSteps.length - 1" class="ts-line" :class="{ 'ts-line--done': step.done }"></div>
              <div class="ts-label">{{ step.label }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Decision } from '@/stores/taskStore'

const props = defineProps<{ decision: Decision }>()
defineEmits<{ (e: 'close'): void }>()

const timelineSteps = computed(() => {
  const approved = props.decision.status === 'Approved'
  return [
    { label: 'Created',    done: true,     active: false },
    { label: 'In Review',  done: approved, active: !approved },
    { label: 'Approved',   done: approved, active: false },
    { label: 'Implemented',done: false,    active: false },
  ]
})
</script>

<style scoped>
.detail-root { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-family: 'Inter', sans-serif; }

/* Bar */
.detail-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; gap: 12px;
}
.detail-bar-left { display: flex; align-items: center; gap: 10px; }
.back-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; color: #475569; cursor: pointer; transition: background .12s; }
.back-btn:hover { background: #f1f5f9; }
.detail-bar-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.dec-id-badge { font-size: 11px; font-weight: 700; background: #eef2ff; color: #4f46e5; padding: 2px 8px; border-radius: 6px; font-family: monospace; }
.detail-bar-right { display: flex; align-items: center; gap: 8px; }
.status-chip { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.status-approved { background: #f0fdf4; color: #16a34a; }
.status-pending  { background: #fffbeb; color: #d97706; }
.hdr-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 500; color: #475569; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s; }
.hdr-btn:hover { background: #f1f5f9; }
.hdr-btn--primary { background: #4f46e5; border-color: #4f46e5; color: #fff; }
.hdr-btn--primary:hover { background: #4338ca; }

/* Body */
.detail-body { flex: 1; overflow-y: auto; padding: 20px 24px; background: #f8fafc; }
.detail-card { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 24px; max-width: 860px; margin: 0 auto; }

/* Title section */
.dc-title-section { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
.dc-icon { width: 44px; height: 44px; border-radius: 12px; background: #eef2ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dc-main-title { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 6px; line-height: 1.3; }
.dc-meta-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.dc-meta-item { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: #64748b; }
.dc-meta-sep { color: #cbd5e1; }
.impact-chip { font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.impact-high   { background: #fef2f2; color: #ef4444; }
.impact-medium { background: #fffbeb; color: #d97706; }
.impact-low    { background: #f0fdf4; color: #16a34a; }

.dc-divider { height: 1px; background: #f1f5f9; margin: 20px 0; }

/* Info grid */
.dc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.dc-section { display: flex; flex-direction: column; gap: 6px; }
.dc-section--full { grid-column: 1 / -1; }
.dc-section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; }
.dc-section-body { font-size: 13px; color: #1e293b; line-height: 1.6; }
.dc-preformat { white-space: pre-wrap; background: #f8fafc; border-radius: 8px; padding: 12px; font-size: 12.5px; }
.dc-link { color: #4f46e5; font-weight: 500; text-decoration: none; }
.dc-link:hover { text-decoration: underline; }

/* Timeline */
.dc-timeline {}
.timeline-steps { display: flex; align-items: flex-start; gap: 0; }
.ts-step { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.ts-dot {
  width: 24px; height: 24px; border-radius: 50%; border: 2px solid #e2e8f0;
  background: #fff; display: flex; align-items: center; justify-content: center;
  z-index: 1; flex-shrink: 0;
}
.ts-done .ts-dot { background: #10b981; border-color: #10b981; }
.ts-active .ts-dot { border-color: #4f46e5; box-shadow: 0 0 0 4px rgba(79,70,229,.15); }
.ts-line { position: absolute; top: 11px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 0; }
.ts-line--done { background: #10b981; }
.ts-label { font-size: 11px; font-weight: 500; color: #64748b; margin-top: 6px; text-align: center; }
.ts-done .ts-label { color: #10b981; font-weight: 600; }
.ts-active .ts-label { color: #4f46e5; font-weight: 600; }
</style>
