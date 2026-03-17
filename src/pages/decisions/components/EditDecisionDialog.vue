<template>
  <div v-if="modelValue" class="dialog-overlay" @click.self="close">
    <div class="dialog-box">
      <div class="dialog-header">
        <span class="dialog-title">Edit Decision</span>
        <button class="close-btn" @click="close">✕</button>
      </div>

      <div class="dialog-body">
        <div class="field-group">
          <label class="field-label">Decision Title <span class="required">*</span></label>
          <input
            v-model="formData.title"
            class="field-input"
            :class="{ 'field-error': errors.title }"
            placeholder="What decision needs to be made?"
          />
          <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
        </div>

        <div class="field-group">
          <label class="field-label">Reason <span class="required">*</span></label>
          <textarea
            v-model="formData.reason"
            class="field-input field-textarea"
            :class="{ 'field-error': errors.reason }"
            placeholder="Why is this decision needed?"
            rows="3"
          ></textarea>
          <span v-if="errors.reason" class="error-msg">{{ errors.reason }}</span>
        </div>

        <div class="field-group">
          <label class="field-label">Impact <span class="required">*</span></label>
          <div class="impact-buttons">
            <button
              v-for="level in ['High', 'Medium', 'Low']"
              :key="level"
              type="button"
              class="impact-btn"
              :class="[`impact-${level.toLowerCase()}`, { active: formData.impact === level }]"
              @click="formData.impact = level as 'High' | 'Medium' | 'Low'"
            >{{ level }}</button>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Linked Work Item</label>
          <select v-model="formData.linkedWork" class="field-input field-select">
            <option value="">Select task or sprint...</option>
            <option v-for="issue in issues" :key="issue.id" :value="`${issue.key} ${issue.summary}`">
              {{ issue.key }} {{ issue.summary }}
            </option>
          </select>
        </div>

        <div class="field-group">
          <label class="field-label">Options Considered <span class="optional">(optional)</span></label>
          <textarea
            v-model="formData.optionsConsidered"
            class="field-input field-textarea"
            placeholder="List options if applicable"
            rows="3"
          ></textarea>
        </div>

        <div class="field-group">
          <label class="field-label">Decision Made <span class="optional">(optional)</span></label>
          <textarea
            v-model="formData.decisionMade"
            class="field-input field-textarea"
            placeholder="Describe the decision outcome"
            rows="3"
          ></textarea>
        </div>

        <div class="field-group">
          <label class="field-label">Status</label>
          <div class="status-buttons">
            <button
              v-for="s in ['Pending', 'Approved']"
              :key="s"
              type="button"
              class="status-btn"
              :class="[`status-${s.toLowerCase()}`, { active: formData.status === s }]"
              @click="formData.status = s as 'Approved' | 'Pending'"
            >{{ s }}</button>
          </div>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn-cancel" @click="close">Cancel</button>
        <button class="btn-primary" @click="save">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Issue, Decision } from '@/stores/taskStore'

const props = defineProps<{
  modelValue: boolean
  decision: Decision | null
  issues: Issue[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', id: string, data: Partial<Decision>): void
}>()

const formData = ref<Partial<Decision & { impact: 'High' | 'Medium' | 'Low'; status: 'Approved' | 'Pending' }>>({})
const errors = ref({ title: '', reason: '' })

watch(() => props.decision, (d) => {
  if (d) {
    formData.value = { ...d }
    errors.value = { title: '', reason: '' }
  }
}, { immediate: true })

const close = () => emit('update:modelValue', false)

const save = () => {
  if (!props.decision) return
  errors.value = { title: '', reason: '' }
  let valid = true
  if (!formData.value.title?.trim()) { errors.value.title = 'Title is required.'; valid = false }
  if (!formData.value.reason?.trim()) { errors.value.reason = 'Reason is required.'; valid = false }
  if (!valid) return
  emit('save', props.decision.id, { ...formData.value })
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}
.dialog-box {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  font-family: 'Inter', sans-serif;
  animation: fadeUp 0.2s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
}
.dialog-title { font-size: 16px; font-weight: 700; color: #0f172a; }
.close-btn {
  background: none; border: none; cursor: pointer;
  font-size: 14px; color: #94a3b8; padding: 4px 8px;
  border-radius: 6px; transition: background 0.15s;
}
.close-btn:hover { background: #f1f5f9; color: #475569; }
.dialog-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13px; font-weight: 600; color: #374151; }
.required { color: #ef4444; }
.optional { font-weight: 400; color: #94a3b8; font-size: 12px; }
.field-input {
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: 'Inter', sans-serif;
}
.field-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); background: #fff; }
.field-input.field-error { border-color: #ef4444; }
.field-textarea { resize: vertical; min-height: 80px; }
.field-select { appearance: none; cursor: pointer; }
.error-msg { font-size: 12px; color: #ef4444; }
.impact-buttons, .status-buttons { display: flex; gap: 8px; }
.impact-btn, .status-btn {
  padding: 6px 16px;
  border-radius: 20px;
  border: 2px solid transparent;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  background: #f1f5f9;
  color: #64748b;
}
.impact-btn.impact-high { border-color: #fecaca; color: #dc2626; background: #fff5f5; }
.impact-btn.impact-high.active { background: #dc2626; color: #fff; border-color: #dc2626; }
.impact-btn.impact-medium { border-color: #fed7aa; color: #d97706; background: #fffbeb; }
.impact-btn.impact-medium.active { background: #d97706; color: #fff; border-color: #d97706; }
.impact-btn.impact-low { border-color: #bbf7d0; color: #16a34a; background: #f0fdf4; }
.impact-btn.impact-low.active { background: #16a34a; color: #fff; border-color: #16a34a; }
.status-btn.status-pending { border-color: #fed7aa; color: #d97706; background: #fffbeb; }
.status-btn.status-pending.active { background: #d97706; color: #fff; border-color: #d97706; }
.status-btn.status-approved { border-color: #bbf7d0; color: #16a34a; background: #f0fdf4; }
.status-btn.status-approved.active { background: #16a34a; color: #fff; border-color: #16a34a; }
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 0 0 14px 14px;
}
.btn-cancel {
  padding: 8px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
  font-family: 'Inter', sans-serif;
}
.btn-cancel:hover { background: #f1f5f9; }
.btn-primary {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  font-family: 'Inter', sans-serif;
}
.btn-primary:hover { background: #4338ca; }
</style>
