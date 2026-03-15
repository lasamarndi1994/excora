import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// Our overrides — must come after vuetify/styles to win the cascade
// import '@/styles/settings.scss'


export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#F7F8FA',
          surface: '#FFFFFF',
          primary: '#4F46E5',
          'primary-darken-1': '#3730A3',
          secondary: '#64748B',
          error: '#EF4444',
          info: '#3B82F6',
          success: '#10B981',
          warning: '#F59E0B',
          'surface-variant': '#F1F5F9',
          'on-surface-variant': '#475569',
        },
      },
      dark: {
        dark: true,
        colors: {
          background: '#0F1117',
          surface: '#1A1D27',
          primary: '#6366F1',
          'primary-darken-1': '#4F46E5',
          secondary: '#94A3B8',
          error: '#F87171',
          info: '#60A5FA',
          success: '#34D399',
          warning: '#FBBF24',
          'surface-variant': '#252836',
          'on-surface-variant': '#94A3B8',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      variant: 'flat',
      style: 'text-transform: none; letter-spacing: normal; font-weight: 500;',
    },
    VCard: {
      elevation: 0,
      border: true,
    },
    VTextField: {
      variant: 'outlined',
      density: 'compact',
    },
    VSelect: {
      variant: 'outlined',
      density: 'compact',
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'compact',
    },
    VCombobox: {
      variant: 'outlined',
      density: 'compact',
    },
    VTooltip: {
      contentClass: 'bg-grey-darken-4 text-caption rounded-lg px-3 py-2',
    },
  },
})
