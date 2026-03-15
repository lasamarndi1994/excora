<template>
  <div class="issue-card cursor-pointer" @click="$emit('click', issue)">
    <div class="issue-summary">{{ issue.summary }}</div>
    <div class="issue-footer">
      <div class="d-flex align-center gap-1">
        <v-icon :icon="typeConfig.icon" size="13" :color="typeConfig.color"></v-icon>
        <span class="issue-key">{{ issue.key }}</span>
      </div>
      <div class="d-flex align-center">
        <v-avatar
          v-for="(assignee, i) in issue.assignees.slice(0, 2)"
          :key="assignee.id"
          size="20"
          :class="{ 'ml-n1': i > 0 }"
          style="border: 1.5px solid #fff;"
        >
          <v-img :src="assignee.avatar" :alt="assignee.name" cover />
        </v-avatar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Issue } from '@/stores/taskStore'

const props = defineProps<{ issue: Issue }>()
defineEmits<{ (e: 'click', issue: Issue): void }>()

const typeConfig = computed(() => {
  switch (props.issue.type) {
    case 'Bug':   return { icon: 'mdi-alert-circle', color: '#ef4444' }
    case 'Story': return { icon: 'mdi-bookmark',     color: '#10b981' }
    case 'Epic':  return { icon: 'mdi-lightning-bolt', color: '#a855f7' }
    default:      return { icon: 'mdi-check-bold',   color: '#4f46e5' }
  }
})
</script>

<style scoped>
.issue-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  padding: 10px 12px;
  transition: box-shadow .15s, border-color .15s;
}
.issue-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-color: #c7d2fe;
}
.issue-summary {
  font-size: 12.5px;
  font-weight: 500;
  color: #0f172a;
  line-height: 1.45;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.issue-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.issue-key {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}
.gap-1 { gap: 4px; }
</style>
