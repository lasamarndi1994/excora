import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Issue {
  id: string
  key: string
  summary: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'High' | 'Medium' | 'Low'
  assignees: User[]
  type: 'Task' | 'Bug' | 'Story' | 'Epic'
  epicLink?: string // ID of the epic it belongs to
  sprintId?: string // ID of the sprint it belongs to
}

export interface Epic {
  id: string
  name: string
  summary: string
  color: string
  startDate?: string
  dueDate?: string
  status?: 'In Progress' | 'On Track' | 'Planned' | 'At Risk' | 'Done'
  milestones?: { label: string; date: string }[]
}

export interface User {
  id: string
  name: string
  avatar: string
}

export interface Sprint {
  id: string
  name: string
  status: 'Draft' | 'Active' | 'Completed'
  startDate: string
  endDate: string
  taskCount: number
  progress: number
}

export interface Decision {
  id: string
  title: string
  reason: string
  impact: 'High' | 'Medium' | 'Low'
  linkedWork: string
  optionsConsidered: string
  decisionMade: string
  status: 'Approved' | 'Pending'
  date: string
  createdBy: User
}

export const useTaskStore = defineStore('task', () => {
  const currentUser = ref<User>({
    id: 'u1',
    name: 'Lasam',
    avatar: 'https://i.pravatar.cc/150?u=lasam',
  })

  const users = ref<User[]>([
    currentUser.value,
    { id: 'u2', name: 'Alana Song', avatar: 'https://i.pravatar.cc/150?u=alana' },
    { id: 'u3', name: 'Mitch', avatar: 'https://i.pravatar.cc/150?u=mitch' },
    { id: 'u4', name: 'Rupert', avatar: 'https://i.pravatar.cc/150?u=rupert' },
  ])

  const epics = ref<Epic[]>([
    {
      id: 'e1', name: 'Mobile App Launch', summary: 'Improve NPS for mobile app users',
      color: '#6366f1', startDate: '2025-10-01', dueDate: '2025-12-15',
      status: 'In Progress',
      milestones: [{ label: 'Beta launch', date: '2025-10-20' }, { label: 'GA', date: '2025-12-01' }],
    },
    {
      id: 'e2', name: 'Growth', summary: 'Increase mobile app users by 50%',
      color: '#a855f7', startDate: '2025-11-10', dueDate: '2026-02-28',
      status: 'On Track',
      milestones: [{ label: 'Design freeze', date: '2025-12-15' }],
    },
    {
      id: 'e3', name: 'Analytics', summary: 'Improve in-app analytics',
      color: '#10b981', startDate: '2025-10-20', dueDate: '2026-03-10',
      status: 'In Progress',
      milestones: [{ label: 'v1 release', date: '2025-12-01' }, { label: 'v2', date: '2026-02-01' }],
    },
  ])

  const sprints = ref<Sprint[]>([
    {
      id: 's1',
      name: 'Sprint 24.1 - Q1 Launch',
      status: 'Draft',
      startDate: 'Jan 1, 2024',
      endDate: 'Jan 14, 2024',
      taskCount: 20,
      progress: 75,
    },
    {
      id: 's2',
      name: 'Sprint 24.2 - Feature Refactor',
      status: 'Active',
      startDate: 'Jan 1, 2024',
      endDate: 'Jan 14, 2024',
      taskCount: 25,
      progress: 0,
    },
    {
      id: 's3',
      name: 'Sprint 24.3 - Q1 Launch',
      status: 'Completed',
      startDate: 'Jan 1, 2024',
      endDate: 'Jan 14, 2024',
      taskCount: 20,
      progress: 100,
    },
    {
      id: 's4',
      name: 'Sprint 24.4 - Q1 Launch',
      status: 'Completed',
      startDate: 'Jan 1, 2024',
      endDate: 'Jan 14, 2024',
      taskCount: 20,
      progress: 100,
    },
  ])

  const issues = ref<Issue[]>([
    {
      id: '1',
      key: 'KAN-1',
      summary: 'Research competitors',
      status: 'DONE',
      priority: 'Medium',
      assignees: [users.value[1]!],
      type: 'Story',
      epicLink: 'e1',
      sprintId: 's1',
    },
    {
      id: '2',
      key: 'KAN-2',
      summary: 'Draft technical specifications',
      status: 'IN_PROGRESS',
      priority: 'High',
      assignees: [users.value[0]!],
      type: 'Task',
      epicLink: 'e1',
      sprintId: 's1',
    },
    {
      id: '3',
      key: 'KAN-3',
      summary: 'Design system architecture',
      status: 'TODO',
      priority: 'High',
      assignees: [users.value[2]!],
      type: 'Task',
      epicLink: 'e2',
      sprintId: 's1',
    },
    {
      id: '4',
      key: 'KAN-4',
      summary: 'Setup project repository',
      status: 'DONE',
      priority: 'Low',
      assignees: [users.value[0]!],
      type: 'Task',
      sprintId: 's2',
    },
    {
      id: '5',
      key: 'KAN-5',
      summary: 'Implement authentication',
      status: 'IN_PROGRESS',
      priority: 'High',
      assignees: [users.value[3]!],
      type: 'Story',
      epicLink: 'e3',
      sprintId: 's1',
    },
    {
      id: '6',
      key: 'KAN-6',
      summary: 'Fix login bug on Safari',
      status: 'TODO',
      priority: 'Medium',
      assignees: [users.value[1]!],
      type: 'Bug',
      sprintId: 's1',
    },
  ])

  const decisions = ref<Decision[]>([
    {
      id: 'DEC-001',
      title: 'Choose UI Framework',
      linkedWork: 'Project Alpha / Task-123 UI Design',
      date: '2024-04-15',
      status: 'Approved',
      createdBy: users.value[0]!,
      reason: 'Need to standardize UI components across all projects',
      impact: 'Medium',
      optionsConsidered: '• Angular\n• Vue.js\n• Svelte',
      decisionMade: 'Selected Vue as the primary UI framework.\nRationale: Vue provides a component-based architecture and ecosystem that aligns with our tech stack.\nNext Steps:\n1. Update project documentation\n2. Train team on Vue 3 Composition API',
    },
    {
      id: 'DEC-002',
      title: 'Approve Budget Increase',
      linkedWork: 'Project Beta / Sprint 4',
      date: '2024-04-18',
      status: 'Pending',
      createdBy: users.value[1]!,
      reason: 'Additional resources required to meet the deadline for Q2 release.',
      impact: 'High',
      optionsConsidered: '• Hire 2 more contractors\n• Extend timeline by 3 weeks',
      decisionMade: '',
    },
    {
      id: 'DEC-003',
      title: 'Select Cloud Provider',
      linkedWork: 'Project Gamma / Task-009 Cloud Migration',
      date: '2024-04-20',
      status: 'Approved',
      createdBy: users.value[0]!,
      reason: 'We need to migrate off of baremetal for better scalability.',
      impact: 'High',
      optionsConsidered: '• AWS\n• GCP\n• Azure',
      decisionMade: 'Selected AWS for deep integration with our existing CI/CD pipelines.',
    },
  ])

  const getIssuesByStatus = (status: Issue['status']) => {
    return issues.value.filter(i => i.status === status)
  }

  const moveIssue = (issueId: string, newStatus: Issue['status']) => {
    const issue = issues.value.find(i => i.id === issueId)
    if (issue) {
      issue.status = newStatus
    }
  }

  const createIssue = (issue: Omit<Issue, 'id' | 'key'>) => {
    const newId = (issues.value.length + 1).toString()
    const newKey = `KAN-${newId}`
    issues.value.push({ ...issue, id: newId, key: newKey })
  }

  const addSprint = (sprintData: Omit<Sprint, 'id' | 'taskCount' | 'progress'>) => {
    const newId = `s${sprints.value.length + 1}`
    sprints.value.push({
      ...sprintData,
      id: newId,
      taskCount: 0,
      progress: 0,
    })
  }

  const updateSprint = (sprintId: string, updatedData: Partial<Sprint>) => {
    const index = sprints.value.findIndex(s => s.id === sprintId)
    if (index !== -1) {
      const current = sprints.value[index]
      if (current) {
        sprints.value[index] = { ...current, ...updatedData, id: current.id } as Sprint
      }
    }
  }

  const deleteSprint = (sprintId: string) => {
    // Optional: Also handle issues associated with the sprint here
    // by setting their sprintId to undefined
    issues.value.forEach(issue => {
      if (issue.sprintId === sprintId) {
        issue.sprintId = undefined
      }
    })

    sprints.value = sprints.value.filter(s => s.id !== sprintId)
  }

  // --- Epic Actions ---
  const addEpic = (epicData: Omit<Epic, 'id'>) => {
    const newId = `e${epics.value.length + 1}`
    epics.value.push({ ...epicData, id: newId })
  }

  const updateEpic = (epicId: string, updatedData: Partial<Epic>) => {
    const index = epics.value.findIndex(e => e.id === epicId)
    if (index !== -1) {
      const current = epics.value[index]
      if (current) epics.value[index] = { ...current, ...updatedData, id: current.id } as Epic
    }
  }

  const deleteEpic = (epicId: string) => {
    epics.value = epics.value.filter(e => e.id !== epicId)
    issues.value.forEach(issue => { if (issue.epicLink === epicId) issue.epicLink = undefined })
  }

  // --- Decision Actions ---
  const addDecision = (decisionData: Omit<Decision, 'id'>) => {
    // Generate an ID like DEC-00X
    const num = decisions.value.length + 1
    const newId = `DEC-${num.toString().padStart(3, '0')}`
    decisions.value.push({
      ...decisionData,
      id: newId,
    })
  }

  const updateDecision = (decisionId: string, updatedData: Partial<Decision>) => {
    const index = decisions.value.findIndex(d => d.id === decisionId)
    if (index !== -1) {
      const current = decisions.value[index]
      if (current) {
        decisions.value[index] = { ...current, ...updatedData, id: current.id } as Decision
      }
    }
  }

  const deleteDecision = (decisionId: string) => {
    decisions.value = decisions.value.filter(d => d.id !== decisionId)
  }

  return {
    currentUser,
    users,
    issues,
    epics,
    sprints,
    decisions,
    getIssuesByStatus,
    moveIssue,
    createIssue,
    addSprint,
    updateSprint,
    deleteSprint,
    addEpic,
    updateEpic,
    deleteEpic,
    addDecision,
    updateDecision,
    deleteDecision,
  }
})
