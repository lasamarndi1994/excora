/**
 * router/index.ts
 *
 * Manual route definitions
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/blank.vue'),
      children: [
        {
          path: '',
          name: 'Landing',
          component: () => import('@/pages/LandingPage.vue'),
        },
        {
          path: 'auth/login',
          name: 'Login',
          component: () => import('@/pages/auth/LoginPage.vue'),
        },
      ],
    },
    {
      path: '/',
      component: () => import('@/layouts/default.vue'),
      children: [
        {
          path: 'backlog',
          name: 'Backlog',
          component: () => import('@/pages/ScrumBacklogPage.vue'),
        },
        {
          path: 'board',
          name: 'Board',
          component: () => import('@/pages/BoardPage.vue'),
        },
        {
          path: 'sprint',
          name: 'Sprint',
          component: () => import('@/pages/sprint/SprintPage.vue'),
        },
        {
          path: 'decisions',
          name: 'Decisions',
          component: () => import('@/pages/decisions/DecisionsPage.vue'),
        },
        {
          path: 'overview',
          name: 'Overview',
          component: () => import('@/pages/OverviewPage.vue'),
        },
        {
          path: 'list',
          name: 'List',
          component: () => import('@/pages/TaskListPage.vue'),
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('@/pages/Reports.vue'),
        },
        {
          path: 'reports/:id',
          name: 'ReportDetail',
          component: () => import('@/pages/ReportDetailPage.vue'),
        },
        {
          path: 'timeline',
          name: 'Timeline',
          component: () => import('@/pages/TimelinePage.vue'),
        },
        {
          path: 'roadmap',
          name: 'Roadmap',
          component: () => import('@/pages/RoadmapPage.vue'),
        },
        {
          path: 'dashboard/ceo',
          name: 'CEODashboard',
          component: () => import('@/pages/dashboard/CEODashboard.vue'),
        },
        {
          path: 'dashboard/cto',
          name: 'CTODashboard',
          component: () => import('@/pages/dashboard/CTODashboard.vue'),
        },
        {
          path: 'dashboard/project-manager',
          name: 'ProjectManagerDashboard',
          component: () => import('@/pages/dashboard/ProjectManagerDashboard.vue'),
        },
        {
          path: 'dashboard',
          name: 'UserDashboard',
          component: () => import('@/pages/dashboard/UserDashboard.vue'),
        },
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('@/pages/project/ProjectPage.vue'),
        },
        {
          path: 'project/spaces',
          name: 'Spaces',
          component: () => import('@/pages/project/SpacesPage.vue'),
        },
        {
          path: 'inbox',
          name: 'Inbox',
          component: () => import('@/pages/inbox/InboxPage.vue'),
        },
        {
          path: 'tasks',
          component: () => import('@/pages/task/TaskLayout.vue'),
          children: [
            {
              path: '',
              redirect: '/tasks/list',
            },
            {
              path: 'list',
              name: 'TaskList',
              component: () => import('@/pages/task/tabs/TaskListTab.vue'),
            },
            {
              path: 'board',
              name: 'TaskBoard',
              component: () => import('@/pages/task/tabs/TaskBoardTab.vue'),
            },
            {
              path: 'calendar',
              name: 'TaskCalendar',
              component: () => import('@/pages/task/tabs/TaskCalendarTab.vue'),
            },
            {
              path: 'dashboard',
              name: 'TaskDashboard',
              component: () => import('@/pages/task/tabs/TaskDashboardTab.vue'),
            },
            {
              path: 'files',
              name: 'TaskFiles',
              component: () => import('@/pages/task/tabs/TaskFilesTab.vue'),
            },
          ],
        },
      ],
    },
  ],
})

export default router
