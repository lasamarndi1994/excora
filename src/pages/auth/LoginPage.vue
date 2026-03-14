<template>
  <v-container fluid class="fill-height pa-0 login-bg">
    <v-row no-gutters class="fill-height">
      <!-- Left: Brand panel -->
      <v-col cols="12" md="6" lg="7" class="d-none d-md-flex align-center justify-center position-relative login-left">
        <div class="login-left-content text-white text-center pa-12">
          <div class="brand-mark mb-8">
            <v-icon size="40" color="white">mdi-rocket-launch</v-icon>
          </div>
          <h1 class="text-h3 font-weight-black mb-3 login-heading">Welcome back</h1>
          <p class="text-body-1 mb-10" style="opacity:0.8; max-width: 420px; margin: 0 auto 40px;">
            Manage projects, track progress, and collaborate with your team — all in one place.
          </p>

          <!-- Feature pills -->
          <div class="d-flex flex-wrap justify-center gap-3 mb-10">
            <div v-for="feat in features" :key="feat" class="feature-pill">
              <v-icon size="14" class="mr-1">mdi-check-circle</v-icon>{{ feat }}
            </div>
          </div>

          <!-- Floating stat cards -->
          <div class="d-flex justify-center gap-4 flex-wrap">
            <div v-for="stat in stats" :key="stat.label" class="stat-float-card">
              <div class="text-h5 font-weight-black">{{ stat.value }}</div>
              <div class="text-caption" style="opacity:0.75;">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right: Login form -->
      <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-center bg-surface">
        <div class="w-100 pa-8 pa-md-12" style="max-width: 440px;">
          <!-- Mobile logo -->
          <div class="d-flex d-md-none align-center mb-8">
            <div class="brand-logo-sm mr-3">
              <v-icon size="18" color="white">mdi-rocket-launch</v-icon>
            </div>
            <span class="text-subtitle-1 font-weight-bold">Execora</span>
          </div>

          <div class="mb-8">
            <h2 class="text-h4 font-weight-black mb-2">Sign in</h2>
            <p class="text-body-2 text-medium-emphasis">Enter your credentials to continue.</p>
          </div>

          <v-form @submit.prevent="handleLogin" v-model="isValid">
            <div class="mb-4">
              <label class="text-caption font-weight-semibold text-medium-emphasis d-block mb-1">Email address</label>
              <v-text-field
                v-model="email"
                placeholder="you@example.com"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                color="primary"
                :rules="[rules.required, rules.email]"
                rounded="lg"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </div>

            <div class="mb-5">
              <div class="d-flex align-center justify-space-between mb-1">
                <label class="text-caption font-weight-semibold text-medium-emphasis">Password</label>
                <a href="#" class="text-caption text-primary text-decoration-none font-weight-semibold">Forgot password?</a>
              </div>
              <v-text-field
                v-model="password"
                placeholder="••••••••"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="showPassword = !showPassword"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                color="primary"
                :rules="[rules.required]"
                rounded="lg"
                density="comfortable"
                hide-details="auto"
              ></v-text-field>
            </div>

            <v-checkbox v-model="rememberMe" label="Remember me for 30 days" color="primary" hide-details
              density="compact" class="mb-6"></v-checkbox>

            <v-btn
              block
              color="primary"
              size="large"
              type="submit"
              :loading="loading"
              class="font-weight-bold mb-4"
              rounded="lg"
              height="48"
            >
              Sign in
            </v-btn>
          </v-form>

          <div class="d-flex align-center mb-4">
            <v-divider class="border-opacity-25"></v-divider>
            <span class="px-3 text-caption text-medium-emphasis">or continue with</span>
            <v-divider class="border-opacity-25"></v-divider>
          </div>

          <div class="d-flex gap-3">
            <v-btn variant="outlined" class="flex-grow-1 text-none font-weight-medium" rounded="lg" height="42">
              <v-icon icon="mdi-google" color="#4285F4" size="18" class="mr-2"></v-icon>
              Google
            </v-btn>
            <v-btn variant="outlined" class="flex-grow-1 text-none font-weight-medium" rounded="lg" height="42">
              <v-icon icon="mdi-github" size="18" class="mr-2"></v-icon>
              GitHub
            </v-btn>
          </div>

          <p class="text-center mt-8 text-caption text-medium-emphasis">
            Don't have an account?
            <a href="#" class="text-primary text-decoration-none font-weight-semibold">Create one free</a>
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const isValid = ref(false)

const features = ['Sprint planning', 'Kanban boards', 'Team collaboration', 'Real-time updates']
const stats = [
  { value: '10k+', label: 'Teams' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'Rating' },
]

const rules = {
  required: (v: string) => !!v || 'Required',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Invalid email',
}

const handleLogin = async () => {
  if (!isValid.value) return
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  loading.value = false
  router.push('/dashboard')
}
</script>

<style scoped>
.login-bg {
  background-color: rgb(var(--v-theme-background));
}

.login-left {
  background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #6D28D9 100%);
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.login-left-content {
  position: relative;
  z-index: 1;
}

.login-heading {
  letter-spacing: -0.03em;
}

.brand-mark {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.brand-logo-sm {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 0.78rem;
  font-weight: 500;
  color: white;
  backdrop-filter: blur(4px);
}

.stat-float-card {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 16px;
  padding: 16px 24px;
  backdrop-filter: blur(8px);
  color: white;
  min-width: 100px;
}

.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>
