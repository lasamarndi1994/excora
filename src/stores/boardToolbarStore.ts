import { ref } from 'vue'

export const activeFilters = ref<string[]>([])
export const sortBy        = ref('none')
export const groupBy       = ref('none')
export const searchQuery   = ref('')
export const showDone      = ref(true)
export const showTags      = ref(true)
export const showDates     = ref(true)
export const showAssignees = ref(true)

export const filterOptions = [
  { value: 'incomplete',   label: 'Incomplete only' },
  { value: 'overdue',      label: 'Overdue' },
  { value: 'assigned',     label: 'Assigned to me' },
  { value: 'has-subtasks', label: 'Has subtasks' },
]
export const sortOptions = [
  { value: 'none',      label: 'Default' },
  { value: 'name',      label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'due',       label: 'Due date' },
  { value: 'priority',  label: 'Priority' },
]
export const groupOptions = [
  { value: 'none',     label: 'None' },
  { value: 'priority', label: 'Priority' },
  { value: 'assignee', label: 'Assignee' },
]

export function toggleFilter(v: string) {
  const idx = activeFilters.value.indexOf(v)
  if (idx !== -1) activeFilters.value.splice(idx, 1)
  else activeFilters.value.push(v)
}
