<template>
  <div class="landing">

    <!-- Navbar -->
    <div class="navbar">
      <div class="navbar-inner">
        <div class="d-flex align-center gap-2">
          <v-avatar color="primary" size="28" rounded="lg">
            <v-icon color="white" size="16">mdi-checkbox-marked-circle-outline</v-icon>
          </v-avatar>
          <span class="brand">Execora</span>
        </div>
        <div class="d-flex align-center gap-4">
          <a href="#" class="nav-link">Features</a>
          <a href="#" class="nav-link">Solutions</a>
          <v-btn color="primary" size="small" rounded="lg" class="text-none font-weight-medium px-4" to="/auth/login">
            Login
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Hero -->
    <div class="hero-section">
      <div class="hero-bg-blob"></div>
      <div class="hero-inner">
        <!-- Left -->
        <div class="hero-left">
          <div class="hero-badge">✨ The #1 Software Development Tool</div>
          <h1 class="hero-title">
            Move fast,<br>
            <span class="text-grad">stay aligned</span>,<br>
            and build better.
          </h1>
          <p class="hero-sub">
            The only project management tool you need to plan, track, and release world-class software with zero friction.
          </p>
          <div class="hero-cta-row">
            <v-btn
              color="primary" size="large" rounded="lg"
              class="text-none font-weight-bold btn-primary-hero"
              append-icon="mdi-arrow-right"
              to="/board"
              style="white-space: nowrap;"
            >
              Get Started Free
            </v-btn>
            <v-btn
              variant="outlined" size="large" rounded="lg"
              class="text-none font-weight-semibold"
              prepend-icon="mdi-play-circle-outline"
              style="white-space: nowrap;"
            >
              View Demo
            </v-btn>
          </div>
          <div class="hero-checks">
            <span><v-icon color="success" size="14" class="mr-1">mdi-check-circle</v-icon>No credit card required</span>
            <span><v-icon color="success" size="14" class="mr-1">mdi-check-circle</v-icon>Free for up to 10 users</span>
          </div>
        </div>

        <!-- Right: dashboard mockup -->
        <div class="hero-right">
          <div class="mockup-card">
            <!-- window chrome -->
            <div class="mockup-chrome">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <div class="mockup-body">
              <!-- sidebar -->
              <div class="mockup-sidebar">
                <div class="mock-block primary-block"></div>
                <div class="mock-block grey-block"></div>
                <div class="mock-block grey-block"></div>
                <div class="mock-block grey-block"></div>
              </div>
              <!-- columns -->
              <div class="mockup-cols">
                <div class="mock-col">
                  <div class="mock-col-label">TO DO</div>
                  <div class="mock-task border-primary-l"></div>
                  <div class="mock-task"></div>
                </div>
                <div class="mock-col">
                  <div class="mock-col-label">IN PROGRESS</div>
                  <div class="mock-task border-warning-l"></div>
                </div>
                <div class="mock-col">
                  <div class="mock-col-label">DONE</div>
                  <div class="mock-task border-success-l"></div>
                  <div class="mock-task border-success-l"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- floating badges -->
          <div class="float-badge float-badge-1">
            <v-avatar color="warning" size="24" class="mr-2">
              <span style="font-size:9px;color:white;font-weight:700">JS</span>
            </v-avatar>
            <div>
              <div class="badge-title">New Comment</div>
              <div class="badge-sub">LGTM! Ship it 🚀</div>
            </div>
          </div>

          <div class="float-badge float-badge-2">
            <v-avatar color="success" size="24" class="mr-2">
              <v-icon size="13" color="white">mdi-check</v-icon>
            </v-avatar>
            <div>
              <div class="badge-title">Sprint Velocity</div>
              <div class="badge-sub text-success">+24% Increase</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trusted by -->
    <div class="trusted-section">
      <p class="trusted-label">TRUSTED BY TEAMS AT</p>
      <div class="trusted-track-wrap">
        <div class="trusted-track">
          <div v-for="logo in [...trustedLogos, ...trustedLogos]" :key="logo.name + Math.random()" class="trusted-logo-item">
            <div class="trusted-logo-icon" :style="{ background: logo.bg }">
              <v-icon :color="logo.color" size="18">{{ logo.icon }}</v-icon>
            </div>
            <span class="trusted-logo-name">{{ logo.name }}</span>
          </div>
        </div>
      </div>
      <div class="trusted-stats">
        <div v-for="s in trustedStats" :key="s.label" class="trusted-stat">
          <div class="trusted-stat-value">{{ s.value }}</div>
          <div class="trusted-stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="features-section">
      <div class="section-center">
        <h2 class="section-title">Everything you need to deliver</h2>
        <p class="section-sub">Stop juggling multiple tools. Execora brings your entire product lifecycle into one unified platform.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon" style="background:#eff6ff">
            <v-icon color="primary" size="22">mdi-kanban</v-icon>
          </div>
          <h3 class="feature-title">Flexible Kanban Boards</h3>
          <p class="feature-desc">Visualize work, limit work-in-progress, and maximize efficiency with our powerful, customizable boards.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background:#f5f3ff">
            <v-icon color="purple" size="22">mdi-run-fast</v-icon>
          </div>
          <h3 class="feature-title">Sprint Planning</h3>
          <p class="feature-desc">Plan upcoming sprints, prioritize your backlog, and assign tasks with ease to keep your team meaningfully aligned.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon" style="background:#f0fdf4">
            <v-icon color="success" size="22">mdi-chart-line</v-icon>
          </div>
          <h3 class="feature-title">Real-time Insights</h3>
          <p class="feature-desc">Gain visibility into your team's performance with out-of-the-box reports, velocity charts, and burndown diagrams.</p>
        </div>
      </div>
    </div>

    <!-- Focus section -->
    <div class="focus-section">
      <div class="focus-inner">
        <div class="focus-left">
          <h2 class="focus-title">Focus on code,<br><span class="text-grad">not chaos.</span></h2>
          <p class="focus-sub">Developers love Execora because it stays out of their way. GitHub &amp; GitLab integrations mean you can update status directly from your commit messages.</p>
          <div class="focus-checks">
            <div><v-icon color="primary" size="16" class="mr-2">mdi-check</v-icon>Two-way Git synchronization</div>
            <div><v-icon color="primary" size="16" class="mr-2">mdi-check</v-icon>Automated CI/CD workflows</div>
            <div><v-icon color="primary" size="16" class="mr-2">mdi-check</v-icon>Smart commit linking</div>
          </div>
        </div>
        <div class="focus-right">
          <div class="code-block">
            <div class="code-line"><span class="c-pink">git</span> commit -m <span class="c-green">"feat: add login page #PROJ-123"</span></div>
            <div class="code-line c-grey">PROJ-123 moved to In Progress</div>
            <div class="code-line"><span class="c-blue">➜</span> <span class="c-cyan">my-app</span> <span class="c-amber">git:(main)</span> <span class="c-green">✔</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="cta-section">
      <div class="cta-card">
        <div class="cta-rocket">
          <v-icon size="260" color="white" style="opacity:.12">mdi-rocket-launch</v-icon>
        </div>
        <h2 class="cta-title">Ready to transform how you work?</h2>
        <p class="cta-sub">Join thousands of high-performing teams using Execora today.</p>
        <v-btn size="small" variant="flat" color="white" class="text-primary text-none font-weight-bold px-6 rounded-lg" to="/board">
          Start Your Free Trial
        </v-btn>
        <p class="cta-note">14-day free trial. No credit card required.</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="d-flex align-center gap-2 mb-3">
            <v-avatar color="primary" size="26" rounded="lg">
              <v-icon color="white" size="14">mdi-checkbox-marked-circle-outline</v-icon>
            </v-avatar>
            <span class="brand">Execora</span>
          </div>
          <p class="footer-desc">Empowering teams to achieve greatness through better collaboration and organization.</p>
          <div class="d-flex gap-2 mt-3">
            <v-btn icon size="x-small" variant="tonal" rounded="lg"><v-icon size="14">mdi-twitter</v-icon></v-btn>
            <v-btn icon size="x-small" variant="tonal" rounded="lg"><v-icon size="14">mdi-linkedin</v-icon></v-btn>
            <v-btn icon size="x-small" variant="tonal" rounded="lg"><v-icon size="14">mdi-github</v-icon></v-btn>
          </div>
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Product</div>
          <a href="#" class="footer-link">Features</a>
          <a href="#" class="footer-link">Security</a>
          <a href="#" class="footer-link">Enterprise</a>
        </div>

        <div class="footer-col">
          <div class="footer-col-title">Resources</div>
          <a href="#" class="footer-link">Documentation</a>
          <a href="#" class="footer-link">API</a>
          <a href="#" class="footer-link">Community</a>
          <a href="#" class="footer-link">Blog</a>
        </div>

        <div class="footer-col footer-col-wide">
          <div class="footer-col-title">Stay up to date</div>
          <div class="footer-email-row">
            <input type="email" placeholder="Enter your email" class="footer-email-input" />
            <button class="footer-subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 MyTask Inc. All rights reserved.</span>
        <div class="d-flex gap-4">
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
const trustedLogos = [
  { name: 'Aliceblue',  icon: 'mdi-water',              color: '#3b82f6', bg: '#eff6ff' },
  { name: 'Rise',       icon: 'mdi-trending-up',         color: '#10b981', bg: '#f0fdf4' },
  { name: 'BOT',        icon: 'mdi-robot-outline',       color: '#8b5cf6', bg: '#f5f3ff' },
  { name: 'EKYC',       icon: 'mdi-shield-check-outline',color: '#f59e0b', bg: '#fffbeb' },
  { name: 'ANT',        icon: 'mdi-hexagon-outline',     color: '#ef4444', bg: '#fef2f2' },
  { name: 'Fincommunity',      icon: 'mdi-atom',                color: '#06b6d4', bg: '#ecfeff' },
  { name: 'Voice Blaster',      icon: 'mdi-orbit',               color: '#4f46e5', bg: '#eef2ff' },
]

const trustedStats = [
  { value: '1,00+', label: 'Branch' },
  { value: '2M+',     label: 'Tasks completed' },
  { value: '99.9%',   label: 'Uptime SLA' },
  { value: '4.9 ★',   label: 'Average rating' },
]
</script>

<style scoped>
/* ── Base ── */
.landing {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #1e293b;
  background: #fff;
  overflow-x: hidden;
}

/* ── Navbar ── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f1f5f9;
}
.navbar-inner {
  max-width: 960px;
  margin: 0 auto;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  font-size: 15px;
  font-weight: 700;
  color: #4f46e5;
}
.nav-link {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
}
.nav-link:hover { color: #4f46e5; }

/* ── Hero ── */
.hero-section {
  position: relative;
  background: linear-gradient(160deg, #eef2ff 0%, #f8faff 50%, #ffffff 100%);
  padding: 64px 24px 80px;
  overflow: hidden;
}
.hero-bg-blob {
  position: absolute;
  top: -100px; right: -100px;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.hero-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 48px;
}
.hero-left { flex: 0 0 340px; }
.hero-right { flex: 1; position: relative; }

.hero-badge {
  display: inline-block;
  background: #eff6ff;
  color: #4f46e5;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.25;
  color: #0f172a;
  margin-bottom: 12px;
}
.text-grad {
  background: linear-gradient(120deg, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.65;
  margin: 0;
}
/* ── Hero CTA buttons ── */
.hero-cta-row {
  display: flex; align-items: center; gap: 12px; margin-top: 24px;
}
.btn-primary-hero {
  box-shadow: 0 4px 16px rgba(79,70,229,0.38) !important;
}

/* ── Mockup ── */
.mockup-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  overflow: hidden;
  transform: perspective(800px) rotateY(-6deg) rotateX(3deg);
  transition: transform .4s ease;
}
.mockup-card:hover {
  transform: perspective(800px) rotateY(0deg) rotateX(0deg);
}
.mockup-chrome {
  background: #f1f5f9;
  padding: 8px 12px;
  display: flex;
  gap: 5px;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}
.dot { width: 9px; height: 9px; border-radius: 50%; }
.dot-red    { background: #ef4444; }
.dot-yellow { background: #f59e0b; }
.dot-green  { background: #10b981; }
.mockup-body {
  display: flex;
  background: #f8fafc;
  padding: 10px;
  gap: 10px;
  min-height: 130px;
}
.mockup-sidebar {
  width: 44px;
  background: #fff;
  border-radius: 6px;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid #f1f5f9;
}
.mock-block { border-radius: 4px; height: 18px; }
.primary-block { background: #4f46e5; }
.grey-block { background: #e2e8f0; }
.mockup-cols { display: flex; gap: 8px; flex: 1; }
.mock-col {
  flex: 1;
  background: #fff;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mock-col-label {
  font-size: 9px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: .05em;
  margin-bottom: 2px;
}
.mock-task {
  background: #f8fafc;
  border-radius: 4px;
  height: 28px;
  border: 1px solid #f1f5f9;
}
.border-primary-l { border-left: 3px solid #4f46e5 !important; }
.border-warning-l  { border-left: 3px solid #f59e0b !important; }
.border-success-l  { border-left: 3px solid #10b981 !important; }

/* floating badges */
.float-badge {
  position: absolute;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  min-width: 150px;
}
.float-badge-1 { bottom: -16px; right: 0; animation: floatY 5s ease-in-out infinite; }
.float-badge-2 { top: 16px; left: -16px; animation: floatY 6s ease-in-out infinite 1s; }
.badge-title { font-size: 11px; font-weight: 600; color: #0f172a; }
.badge-sub   { font-size: 10.5px; color: #64748b; }

@keyframes floatY {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

/* ── Trusted ── */
.trusted-section {
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding: 48px 24px 40px;
  text-align: center;
  overflow: hidden;
}
.trusted-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .12em;
  color: #94a3b8;
  margin-bottom: 28px;
}

/* Scrolling marquee */
.trusted-track-wrap {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
  margin-bottom: 40px;
}
.trusted-track {
  display: flex;
  gap: 20px;
  width: max-content;
  animation: marquee 28s linear infinite;
}
.trusted-track:hover { animation-play-state: paused; }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.trusted-logo-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 20px; border-radius: 12px;
  background: #fff; border: 1px solid #e2e8f0;
  white-space: nowrap;
  transition: border-color .2s, box-shadow .2s;
  cursor: default;
}
.trusted-logo-item:hover {
  border-color: #c7d2fe;
  box-shadow: 0 4px 12px rgba(79,70,229,0.08);
}
.trusted-logo-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.trusted-logo-name {
  font-size: 13.5px; font-weight: 700; color: #374151; letter-spacing: -.01em;
}

/* Stats row */
.trusted-stats {
  display: flex; justify-content: center; gap: 0;
  border: 1px solid #e2e8f0; border-radius: 14px;
  background: #fff; overflow: hidden;
  max-width: 680px; margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.trusted-stat {
  flex: 1; padding: 20px 16px; text-align: center;
  border-right: 1px solid #f1f5f9;
}
.trusted-stat:last-child { border-right: none; }
.trusted-stat-value {
  font-size: 22px; font-weight: 900; color: #4f46e5;
  letter-spacing: -.03em; line-height: 1.1; margin-bottom: 4px;
}
.trusted-stat-label {
  font-size: 11.5px; color: #94a3b8; font-weight: 500;
}

/* ── Features ── */
.features-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 64px 24px;
}
.section-center { text-align: center; margin-bottom: 40px; }
.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}
.section-sub {
  font-size: 12.5px;
  color: #64748b;
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 24px 20px;
  transition: transform .2s, box-shadow .2s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.07);
  border-color: #c7d2fe;
}
.feature-icon {
  width: 44px; height: 44px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 14px;
}
.feature-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}
.feature-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* ── Focus ── */
.focus-section {
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding: 64px 24px;
}
.focus-inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 56px;
}
.focus-left { flex: 1; }
.focus-right { flex: 1; }
.focus-title {
  font-size: 26px;
  font-weight: 800;
  line-height: 1.25;
  color: #0f172a;
  margin-bottom: 14px;
}
.focus-sub {
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.65;
  margin-bottom: 20px;
}
.focus-checks {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12.5px;
  font-weight: 500;
  color: #1e293b;
}
.code-block {
  background: #1e293b;
  border-radius: 10px;
  padding: 20px 22px;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.8;
}
.code-line { white-space: pre-wrap; }
.c-pink  { color: #f472b6; }
.c-green { color: #4ade80; }
.c-grey  { color: #94a3b8; }
.c-blue  { color: #60a5fa; }
.c-cyan  { color: #22d3ee; }
.c-amber { color: #fbbf24; }

/* ── CTA ── */
.cta-section {
  padding: 48px 24px;
  max-width: 960px;
  margin: 0 auto;
}
.cta-card {
  background: #4f46e5;
  border-radius: 14px;
  padding: 56px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.cta-rocket {
  position: absolute;
  top: -40px; right: -40px;
  pointer-events: none;
}
.cta-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;
}
.cta-sub {
  font-size: 13px;
  color: rgba(255,255,255,.85);
  margin-bottom: 24px;
}
.cta-note {
  font-size: 11px;
  color: rgba(255,255,255,.6);
  margin-top: 12px;
  margin-bottom: 0;
}

/* ── Footer ── */
.footer-section {
  background: #fff;
  border-top: 1px solid #f1f5f9;
  padding: 48px 24px 24px;
}
.footer-inner {
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr;
  gap: 32px;
  padding-bottom: 32px;
}
.footer-brand { display: block; }
.footer-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.6;
  max-width: 220px;
  margin: 0;
}
.footer-col { display: flex; flex-direction: column; gap: 8px; }
.footer-col-wide { display: flex; flex-direction: column; gap: 8px; }
.footer-col-title {
  font-size: 12.5px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}
.footer-link {
  font-size: 12px;
  color: #64748b;
  text-decoration: none;
}
.footer-link:hover { color: #4f46e5; }
.footer-email-row {
  display: flex;
  gap: 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 4px;
}
.footer-email-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 8px 12px;
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  background: #f8fafc;
}
.footer-subscribe-btn {
  background: #4f46e5;
  color: #fff;
  border: none;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.footer-subscribe-btn:hover { background: #4338ca; }
.footer-bottom {
  max-width: 960px;
  margin: 0 auto;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11.5px;
  color: #94a3b8;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-inner { flex-direction: column; }
  .hero-left { flex: unset; }
  .hero-right { display: none; }
  .features-grid { grid-template-columns: 1fr; }
  .focus-inner { flex-direction: column; }
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .trusted-stats { flex-wrap: wrap; }
  .trusted-stat { min-width: 120px; }
}
@media (max-width: 480px) {
  .footer-inner { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
  .hero-cta-row { flex-direction: column; align-items: flex-start; }
  .hero-title { font-size: 22px; }
  .cta-card { padding: 36px 20px; }
  .cta-title { font-size: 18px; }
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
</style>
