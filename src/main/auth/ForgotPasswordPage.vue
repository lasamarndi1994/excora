<template>
  <div class="fp-root">

    <!-- Left panel -->
    <div class="fp-left">
      <div class="left-content">
        <div class="brand-mark">
          <v-icon size="40" color="white">mdi-rocket-launch</v-icon>
        </div>
        <h1 class="left-title">Reset your<br>password.</h1>
        <p class="left-sub">Enter your email and we'll send you a link to get back into your account.</p>
        <div class="steps">
          <div v-for="(step, i) in steps" :key="i" class="step-item">
            <div class="step-num">{{ i + 1 }}</div>
            <span>{{ step }}</span>
          </div>
        </div>
      </div>
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <!-- Right panel -->
    <div class="fp-right">
      <div class="form-card">

        <!-- Mobile brand -->
        <div class="mobile-brand">
          <div class="brand-icon-sm">
            <v-icon size="16" color="white">mdi-rocket-launch</v-icon>
          </div>
          <span class="brand-name-sm">Execora</span>
        </div>

        <!-- Success state -->
        <div v-if="sent" class="success-state">
          <div class="success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="#4f46e5" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="form-title">Check your email</h2>
          <p class="form-sub">
            We sent a password reset link to<br>
            <strong>{{ email }}</strong>
          </p>
          <p class="resend-text">
            Didn't receive it?
            <button class="resend-btn" @click="resend" :disabled="resendCooldown > 0">
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email' }}
            </button>
          </p>
          <router-link to="/auth/login" class="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back to sign in
          </router-link>
        </div>

        <!-- Form state -->
        <template v-else>
          <div class="form-header">
            <h2 class="form-title">Forgot password?</h2>
            <p class="form-sub">No worries — enter your email and we'll send you reset instructions.</p>
          </div>

          <form @submit.prevent="handleSubmit" class="form-body">
            <div class="field-group">
              <label class="field-label">Email address</label>
              <div class="input-wrap" :class="{ error: emailError }">
                <svg class="input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <input v-model="email" type="email" class="field-input"
                  placeholder="you@example.com" @blur="validateEmail" />
              </div>
              <span v-if="emailError" class="field-error">{{ emailError }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="!loading">Send reset link</span>
              <span v-else class="spinner"></span>
            </button>
          </form>

          <router-link to="/auth/login" class="back-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back to sign in
          </router-link>
        </template>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email      = ref('')
const emailError = ref('')
const loading    = ref(false)
const sent       = ref(false)
const resendCooldown = ref(0)

const steps = [
  'Enter your registered email address',
  'Check your inbox for the reset link',
  'Set a new password and sign in',
]

function validateEmail() {
  if (!email.value) { emailError.value = 'Email is required'; return false }
  if (!/.+@.+\..+/.test(email.value)) { emailError.value = 'Enter a valid email'; return false }
  emailError.value = ''; return true
}

const handleSubmit = async () => {
  if (!validateEmail()) return
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  loading.value = false
  sent.value = true
  startCooldown()
}

function startCooldown() {
  resendCooldown.value = 60
  const t = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(t)
  }, 1000)
}

const resend = async () => {
  if (resendCooldown.value > 0) return
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  loading.value = false
  startCooldown()
}
</script>

<style scoped>
.fp-root {
  display: flex; min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Left panel */
.fp-left {
  flex: 1; display: none;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #6d28d9 100%);
  position: relative; overflow: hidden;
  align-items: center; justify-content: center;
}
@media (min-width: 768px) { .fp-left { display: flex; } }

.left-content {
  position: relative; z-index: 2;
  padding: 48px; max-width: 480px; width: 100%;
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
  margin: 0 auto 44px; max-width: 360px;
}

.steps { display: flex; flex-direction: column; gap: 16px; text-align: left; }
.step-item {
  display: flex; align-items: center; gap: 14px;
  font-size: 14px; color: rgba(255,255,255,0.9); font-weight: 500;
}
.step-num {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff;
}

.blob {
  position: absolute; border-radius: 50%;
  background: rgba(255,255,255,0.06); pointer-events: none;
}
.blob-1 { width: 400px; height: 400px; top: -120px; right: -100px; }
.blob-2 { width: 300px; height: 300px; bottom: -80px; left: -60px; }

/* Right panel */
.fp-right {
  width: 100%; display: flex; align-items: center; justify-content: center;
  background: #f8fafc; padding: 32px 16px;
}
@media (min-width: 768px) { .fp-right { width: 480px; flex-shrink: 0; background: #fff; } }

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
.form-title { font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -.03em; margin: 0 0 8px; }
.form-sub   { font-size: 14px; color: #64748b; margin: 0; line-height: 1.6; }

.form-body { display: flex; flex-direction: column; }

.field-group { margin-bottom: 20px; }
.field-label { font-size: 12.5px; font-weight: 600; color: #374151; display: block; margin-bottom: 6px; }

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
.field-error { font-size: 11.5px; color: #ef4444; margin-top: 5px; display: block; }

.submit-btn {
  width: 100%; padding: 13px; border-radius: 10px; border: none;
  background: #4f46e5; color: #fff; font-size: 14px; font-weight: 700;
  font-family: 'Inter', sans-serif; cursor: pointer;
  transition: background .15s, box-shadow .15s;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(79,70,229,0.35); margin-bottom: 24px;
}
.submit-btn:hover:not(:disabled) { background: #4338ca; box-shadow: 0 6px 20px rgba(79,70,229,0.4); }
.submit-btn:disabled { opacity: .7; cursor: not-allowed; }

.spinner {
  width: 18px; height: 18px; border-radius: 50%;
  border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #4f46e5; text-decoration: none;
  transition: gap .15s;
}
.back-link:hover { gap: 4px; text-decoration: underline; }

/* Success state */
.success-state { display: flex; flex-direction: column; align-items: flex-start; gap: 0; }

.success-icon {
  width: 56px; height: 56px; border-radius: 16px; margin-bottom: 24px;
  background: #eef2ff; border: 1px solid #c7d2fe;
  display: flex; align-items: center; justify-content: center;
}

.success-state .form-title { margin-bottom: 10px; }
.success-state .form-sub { margin-bottom: 24px; color: #64748b; font-size: 14px; line-height: 1.7; }
.success-state .form-sub strong { color: #0f172a; }

.resend-text {
  font-size: 13px; color: #64748b; margin-bottom: 28px;
}
.resend-btn {
  background: none; border: none; cursor: pointer;
  font-size: 13px; font-weight: 600; color: #4f46e5;
  font-family: 'Inter', sans-serif; padding: 0;
  transition: opacity .15s;
}
.resend-btn:disabled { opacity: .5; cursor: not-allowed; }
.resend-btn:not(:disabled):hover { text-decoration: underline; }
</style>
