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
          component: () => import('@/main/LandingPage.vue'),
        },
        {
          path: 'auth/login',
          name: 'Login',
          component: () => import('@/main/auth/LoginPage.vue'),
        },
        {
          path: 'auth/forgot-password',
          name: 'ForgotPassword',
          component: () => import('@/main/auth/ForgotPasswordPage.vue'),
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
          component: () => import('@/main/ScrumBacklogPage.vue'),
        },
        {
          path: 'board',
          name: 'Board',
          component: () => import('@/main/BoardPage.vue'),
        },
        {
          path: 'sprint',
          name: 'Sprint',
          component: () => import('@/main/sprint/SprintPage.vue'),
        },

        {
          path: 'overview',
          name: 'Overview',
          component: () => import('@/main/OverviewPage.vue'),
        },
        {
          path: 'list',
          name: 'List',
          component: () => import('@/main/TaskListPage.vue'),
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('@/main/Reports.vue'),
        },
        {
          path: 'reports/:id',
          name: 'ReportDetail',
          component: () => import('@/main/ReportDetailPage.vue'),
        },
        {
          path: 'timeline',
          name: 'Timeline',
          component: () => import('@/main/TimelinePage.vue'),
        },
        {
          path: 'roadmap',
          name: 'Roadmap',
          component: () => import('@/main/RoadmapPage.vue'),
        },
        {
          path: 'dashboard/ceo',
          name: 'CEODashboard',
          component: () => import('@/main/dashboard/CEODashboard.vue'),
        },
        {
          path: 'dashboard/cto',
          name: 'CTODashboard',
          component: () => import('@/main/dashboard/CTODashboard.vue'),
        },
        {
          path: 'dashboard/project-manager',
          name: 'ProjectManagerDashboard',
          component: () => import('@/main/dashboard/ProjectManagerDashboard.vue'),
        },
        {
          path: 'dashboard',
          name: 'UserDashboard',
          component: () => import('@/main/dashboard/UserDashboard.vue'),
        },
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('@/main/project/ProjectPage.vue'),
        },
        {
          path: 'project/spaces',
          name: 'Spaces',
          component: () => import('@/main/project/AllProjectPage.vue'),
        },
        {
          path: 'inbox',
          name: 'Inbox',
          component: () => import('@/main/inbox/InboxPage.vue'),
        },
        {
          path: 'tasks',
          component: () => import('@/main/task/TaskLayout.vue'),
          children: [
            {
              path: '',
              redirect: '/tasks/list',
            },
            {
              path: 'list',
              name: 'TaskList',
              component: () => import('@/main/task/tabs/TaskListTab.vue'),
            },
            {
              path: 'board',
              name: 'TaskBoard',
              component: () => import('@/main/task/tabs/TaskBoardTab.vue'),
            },
            {
              path: 'calendar',
              name: 'TaskCalendar',
              component: () => import('@/main/task/tabs/TaskCalendarTab.vue'),
            },
            {
              path: 'dashboard',
              name: 'TaskDashboard',
              component: () => import('@/main/task/tabs/TaskDashboardTab.vue'),
            },
            {
              path: 'files',
              name: 'TaskFiles',
              component: () => import('@/main/task/tabs/TaskFilesTab.vue'),
            },
          ],
        },
        {
          path: 'decisions',
          name: 'Decisions',
          component: () => import('@/main/decisions/DecisionsPage.vue'),
        },
      ],
    },
  ],
})

export default router
