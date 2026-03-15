<template>
  <div class="login-root">
    <!-- Left panel -->
    <div class="login-left">
      <div class="left-content">
        <div class="brand-mark">
          <v-icon size="40" color="white">mdi-rocket-launch</v-icon>
        </div>
        <h1 class="left-title">Welcome back</h1>
        <p class="left-sub">Manage projects, track progress, and collaborate with your team — all in one place.</p>
        <div class="feature-pills">
          <div v-for="f in features" :key="f" class="feature-pill">
            <v-icon size="14" class="pill-icon">mdi-check-circle</v-icon>
            {{ f }}
          </div>
        </div>
        <div class="stats-row">
          <div v-for="s in stats" :key="s.label" class="stat-card">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>
    <!-- Right panel -->
    <div class="login-right">
      <div class="form-card">
        <div class="mobile-brand">
          <div class="brand-icon-sm">
            <v-icon size="16" color="white">mdi-rocket-launch</v-icon>
          </div>
          <span class="brand-name-sm">Execora</span>
        </div>
        <div class="form-header">
          <h2 class="form-title">Welcome back</h2>
          <p class="form-sub">Sign in to your account to continue.</p>
        </div>
        <form @submit.prevent="handleLogin" class="form-body">
          <!-- Email -->
          <div class="field-group">
            <label class="field-label">Email address</label>
            <div class="input-wrap" :class="{ error: emailError }">
              <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input v-model="email" type="email" class="field-input" placeholder="you@example.com" @blur="validateEmail" />
            </div>
            <span v-if="emailError" class="field-error">{{ emailError }}</span>
          </div>
          <!-- Password -->
          <div class="field-group">
            <div class="field-label-row">
              <label class="field-label">Password</label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>
            <div class="input-wrap" :class="{ error: passwordError }">
              <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="1.8"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" class="field-input" placeholder="••••••••" @blur="validatePassword" />
              <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.8"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>
                </svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <span v-if="passwordError" class="field-error">{{ passwordError }}</span>
          </div>
          <!-- Remember me -->
          <label class="remember-row">
            <input type="checkbox" v-model="rememberMe" class="remember-check" />
            <span class="remember-label">Remember me for 30 days</span>
          </label>
          <!-- Submit -->
          <button type="submit" class="submit-btn" :class="{ loading }" :disabled="loading">
            <span v-if="!loading">Sign in</span>
            <span v-else class="spinner"></span>
          </button>
        </form>
        <div class="or-divider"><span>or continue with</span></div>
        <div class="social-row">
          <button class="social-btn">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button class="social-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>
        <p class="signup-text">Don't have an account? <a href="#" class="signup-link">Create one free</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email        = ref('')
const password     = ref('')
const rememberMe   = ref(false)
const showPassword = ref(false)
const loading      = ref(false)
const emailError   = ref('')
const passwordError = ref('')

const features = [
  'Sprint planning',
  'Kanban boards',
  'Team collaboration',
  'Real-time updates',
]
const stats = [
  { value: '10k+', label: 'Teams' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'Rating' },
]

function validateEmail() {
  if (!email.value) { emailError.value = 'Email is required'; return false }
  if (!/.+@.+\..+/.test(email.value)) { emailError.value = 'Enter a valid email'; return false }
  emailError.value = ''; return true
}
function validatePassword() {
  if (!password.value) { passwordError.value = 'Password is required'; return false }
  passwordError.value = ''; return true
}

const handleLogin = async () => {
  const ok = validateEmail() && validatePassword()
  if (!ok) return
  loading.value = true
  await new Promise(r => setTimeout(r, 700))
  loading.value = false
  router.push('/dashboard')
}
</script>

<style scoped>
.login-root {
  display: flex; min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Left panel */
.login-left {
  flex: 1; display: none;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #6d28d9 100%);
  position: relative; overflow: hidden;
  align-items: center; justify-content: center;
}
@media (min-width: 768px) { .login-left { display: flex; } }

.left-content {
  position: relative; z-index: 2;
  padding: 48px; max-width: 520px; width: 100%;
  text-align: center;
}

.brand-mark {
  width: 72px; height: 72px; border-radius: 20px;
  background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 32px;
}

.left-title {
  font-size: 40px; font-weight: 900; color: #fff;
  line-height: 1.15; letter-spacing: -.03em; margin: 0 0 16px;
}
.left-sub {
  font-size: 15.5px; color: rgba(255,255,255,0.78); line-height: 1.6;
  margin: 0 auto 40px; max-width: 380px;
}

.feature-pills {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 10px; margin-bottom: 48px;
}
.feature-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 999px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
  font-size: 12.5px; font-weight: 500; color: #fff;
  backdrop-filter: blur(4px);
}
.pill-icon { opacity: 0.85; }

.stats-row { display: flex; gap: 12px; }
.stat-card {
  flex: 1; padding: 16px 20px; border-radius: 14px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(8px); text-align: center;
}
.stat-value { font-size: 22px; font-weight: 900; color: #fff; line-height: 1.1; }
.stat-label { font-size: 11.5px; color: rgba(255,255,255,0.65); margin-top: 3px; }

.blob {
  position: absolute; border-radius: 50%;
  background: rgba(255,255,255,0.06); pointer-events: none;
}
.blob-1 { width: 400px; height: 400px; top: -120px; right: -100px; }
.blob-2 { width: 300px; height: 300px; bottom: -80px; left: -60px; }

/* Right panel */
.login-right {
  width: 100%; display: flex; align-items: center; justify-content: center;
  background: #f8fafc; padding: 32px 16px;
}
@media (min-width: 768px) { .login-right { width: 480px; flex-shrink: 0; background: #fff; } }

.form-card { width: 100%; max-width: 400px; }

.mobile-brand {
  display: flex; align-items: center; gap: 8px; margin-bottom: 32px;
}
@media (min-width: 768px) { .mobile-brand { display: none; } }
.brand-icon-sm {
  width: 30px; height: 30px; border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex; align-items: center; justify-content: center;
}
.brand-name-sm { font-size: 15px; font-weight: 800; color: #0f172a; }

.form-header { margin-bottom: 28px; }
.form-title { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -.03em; margin: 0 0 6px; }
.form-sub   { font-size: 14px; color: #64748b; margin: 0; }

.form-body { display: flex; flex-direction: column; }

.field-group { margin-bottom: 18px; }
.field-label { font-size: 12.5px; font-weight: 600; color: #374151; display: block; margin-bottom: 6px; }
.field-label-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.forgot-link { font-size: 12.5px; font-weight: 600; color: #4f46e5; text-decoration: none; }
.forgot-link:hover { text-decoration: underline; }

.input-wrap {
  display: flex; align-items: center; gap: 10px;
  padding: 0 12px; border: 1.5px solid #e2e8f0; border-radius: 10px;
  background: #fff; transition: border-color .15s, box-shadow .15s;
}
.input-wrap:focus-within { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,0.1); }
.input-wrap.error { border-color: #ef4444; }
.input-wrap.error:focus-within { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); }
.input-icon { color: #94a3b8; flex-shrink: 0; }
.field-input {
  flex: 1; border: none; outline: none; background: transparent;
  padding: 11px 0; font-size: 14px; color: #0f172a;
  font-family: 'Inter', sans-serif;
}
.field-input::placeholder { color: #cbd5e1; }
.eye-btn {
  background: none; border: none; cursor: pointer; color: #94a3b8;
  display: flex; align-items: center; padding: 0; transition: color .15s;
}
.eye-btn:hover { color: #475569; }
.field-error { font-size: 11.5px; color: #ef4444; margin-top: 5px; display: block; }

.remember-row {
  display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 22px;
}
.remember-check { width: 16px; height: 16px; border-radius: 4px; cursor: pointer; accent-color: #4f46e5; }
.remember-label { font-size: 13px; color: #374151; }

.submit-btn {
  width: 100%; padding: 13px; border-radius: 10px; border: none;
  background: #4f46e5; color: #fff; font-size: 14px; font-weight: 700;
  font-family: 'Inter', sans-serif; cursor: pointer;
  transition: background .15s, transform .1s, box-shadow .15s;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(79,70,229,0.35); margin-bottom: 20px;
}
.submit-btn:hover:not(:disabled) { background: #4338ca; box-shadow: 0 6px 20px rgba(79,70,229,0.4); }
.submit-btn:active:not(:disabled) { transform: scale(0.99); }
.submit-btn:disabled { opacity: .7; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.or-divider {
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
}
.or-divider::before, .or-divider::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
.or-divider span { font-size: 12px; color: #94a3b8; white-space: nowrap; }

.social-row { display: flex; gap: 10px; margin-bottom: 28px; }
.social-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px; border-radius: 10px; border: 1.5px solid #e2e8f0;
  background: #fff; font-size: 13px; font-weight: 600; color: #374151;
  font-family: 'Inter', sans-serif; cursor: pointer;
  transition: background .15s, border-color .15s;
}
.social-btn:hover { background: #f8fafc; border-color: #c7d2fe; }

.signup-text { text-align: center; font-size: 13px; color: #64748b; margin: 0; }
.signup-link { color: #4f46e5; font-weight: 700; text-decoration: none; }
.signup-link:hover { text-decoration: underline; }
</style>
