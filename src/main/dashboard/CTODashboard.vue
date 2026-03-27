<template>
  <div class="dash">

    <!-- Header -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">CTO Dashboard</h1>
        <p class="dash-sub">System Health, Engineering Performance &amp; Infrastructure</p>
      </div>
      <button class="action-btn">
        <v-icon size="14" class="mr-1">mdi-download</v-icon>Export Report
      </button>
    </div>

    <!-- Stat cards -->
    <div class="stat-row">
      <div v-for="stat in metrics" :key="stat.label" class="stat-card" :style="{ '--accent': stat.accent }">
        <div class="stat-card-inner">
          <div class="stat-icon-wrap">
            <div class="stat-icon-bg" :style="{ background: stat.iconBg }">
              <v-icon :color="stat.iconColor" size="22">{{ stat.icon }}</v-icon>
            </div>
            <div class="stat-sparkle"></div>
          </div>
          <div class="stat-info">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-val">{{ stat.value }}</div>
          </div>
        </div>
        <div class="stat-bar">
          <div class="stat-bar-fill" :style="{ width: stat.pct + '%', background: stat.accent }"></div>
        </div>
        <div class="stat-footer">
          <span class="stat-trend" :class="stat.trendUp ? 'trend-up' : 'trend-down'">
            <v-icon size="11">{{ stat.trendUp ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
            {{ stat.trend }}
          </span>
          <span class="stat-period">vs last month</span>
        </div>
        <div class="stat-glow" :style="{ background: stat.accent }"></div>
      </div>
    </div>

    <!-- Main grid: System Health | Team Velocity | Detailed Metrics (full row) -->
    <div class="cto-grid">

      <!-- System Health -->
      <div class="panel cto-health">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#10b981"></div>
            <span class="panel-title">System Health</span>
          </div>
        </div>
        <div class="health-grid">
          <div class="health-card">
            <div class="health-label">System Uptime</div>
            <div class="health-val text-success">99.99%</div>
            <div class="health-sub">Target: 99.95%</div>
            <v-progress-linear model-value="99.99" color="success" height="6" rounded bg-color="success-lighten-4" class="mt-2"></v-progress-linear>
            <div class="health-note success-note">
              <v-icon size="small" color="success" class="mr-1">mdi-check-circle-outline</v-icon>
              No major outages in 30 days.
            </div>
          </div>
          <div class="health-card">
            <div class="health-label">Avg. API Latency</div>
            <div class="health-val text-primary">45ms</div>
            <v-chip color="success" size="x-small" variant="tonal" class="mb-2 font-weight-bold">
              <v-icon start size="x-small">mdi-arrow-down</v-icon> 12%
            </v-chip>
            <div class="sparkline-row">
              <div v-for="n in 10" :key="n" class="sparkline-bar bg-primary rounded-t"
                :style="`height: ${20 + (n * 7) % 30}px`"></div>
            </div>
          </div>
          <div class="health-card">
            <div class="health-label">Error Rate</div>
            <div class="health-val text-error">0.02%</div>
            <v-chip color="error" size="x-small" variant="tonal" class="mb-2 font-weight-bold">
              <v-icon start size="x-small">mdi-arrow-up</v-icon> 0.01%
            </v-chip>
            <div class="error-note">
              <v-icon size="small" class="mr-1">mdi-alert-circle-outline</v-icon>
              Spike: Payment Service (02:00 AM)
            </div>
          </div>
          <div class="health-card">
            <div class="health-label">Deployments (Today)</div>
            <div class="health-val text-info">14</div>
            <div class="health-sub">3 Pending</div>
            <div class="d-flex gap-2 mt-2">
              <v-chip size="small" color="success" variant="flat" class="font-weight-bold">Success: 12</v-chip>
              <v-chip size="small" color="error" variant="flat" class="font-weight-bold">Failed: 2</v-chip>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Velocity -->
      <div class="panel vel-panel cto-velocity">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#4f46e5"></div>
            <span class="panel-title">Team Velocity</span>
          </div>
          <span class="vel-sprint-badge">Sprint 24</span>
        </div>
        <div class="vel-summary">
          <div class="vel-ring-wrap">
            <svg viewBox="0 0 80 80" class="vel-ring-svg">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" stroke-width="8"/>
              <circle cx="40" cy="40" r="32" fill="none" stroke="url(#velGrad)" stroke-width="8"
                stroke-linecap="round" stroke-dasharray="201"
                :stroke-dashoffset="201 - (201 * totalProgress / 100)"
                class="vel-ring-arc" transform="rotate(-90 40 40)"/>
              <defs>
                <linearGradient id="velGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#4f46e5"/>
                  <stop offset="100%" stop-color="#a855f7"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="vel-ring-center">
              <div class="vel-ring-val">{{ totalVelocity }}</div>
              <div class="vel-ring-lbl">pts</div>
            </div>
          </div>
          <div class="vel-summary-stats">
            <div class="vel-stat">
              <div class="vel-stat-val">{{ teams.length }}</div>
              <div class="vel-stat-lbl">Teams</div>
            </div>
            <div class="vel-stat-divider"></div>
            <div class="vel-stat">
              <div class="vel-stat-val">{{ totalProgress }}%</div>
              <div class="vel-stat-lbl">Capacity</div>
            </div>
            <div class="vel-stat-divider"></div>
            <div class="vel-stat">
              <div class="vel-stat-val trend-up">+6%</div>
              <div class="vel-stat-lbl">vs last</div>
            </div>
          </div>
        </div>
        <div class="vel-teams">
          <div v-for="(team, i) in teams" :key="i" class="vel-team-row" :style="{ animationDelay: i * 80 + 'ms' }">
            <div class="vel-team-left">
              <div class="vel-avatar" :style="{ background: team.avatarBg, color: team.avatarColor }">{{ team.initials }}</div>
              <div>
                <div class="vel-team-name">{{ team.name }}</div>
                <div class="vel-team-meta">{{ team.members }} members · {{ team.sprint }}</div>
              </div>
            </div>
            <div class="vel-sparkline">
              <svg viewBox="0 0 60 24" class="vel-spark-svg">
                <polyline :points="team.sparkPoints" fill="none" :stroke="team.hex"
                  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="vel-spark-line"/>
                <circle :cx="team.sparkLastX" :cy="team.sparkLastY" r="2.5" :fill="team.hex"/>
              </svg>
            </div>
            <div class="vel-team-right">
              <div class="vel-pts-row">
                <span class="vel-pts">{{ team.velocity }}<span class="vel-pts-unit">pts</span></span>
                <span class="vel-delta" :class="team.deltaUp ? 'trend-up' : 'trend-down'">
                  <v-icon size="9">{{ team.deltaUp ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>{{ team.delta }}
                </span>
              </div>
              <div class="vel-bar-track">
                <div class="vel-bar-fill" :style="{ width: team.progress + '%', background: team.hex, animationDelay: i * 100 + 'ms' }"></div>
              </div>
              <div class="vel-cap-label">{{ team.progress }}% capacity</div>
            </div>
          </div>
        </div>
        <div class="vel-alert">
          <div class="vel-alert-icon">⚠️</div>
          <div class="vel-alert-text"><strong>Frontend Experience</strong> is 10% below capacity due to holidays. Consider adjusting sprint scope.</div>
        </div>
      </div>

      <!-- Detailed Metrics — spans full width -->
      <div class="panel cto-metrics">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#06b6d4"></div>
            <span class="panel-title">Detailed Metrics</span>
          </div>
          <div class="cto-tab-group">
            <button v-for="t in ['infrastructure','security','techdebt']" :key="t"
              class="cto-tab" :class="{ active: tab === t }" @click="tab = t">
              {{ tabLabels[t] }}
            </button>
          </div>
        </div>

        <!-- Infrastructure -->
        <div v-if="tab === 'infrastructure'" class="cto-tab-body">
          <div class="infra-grid">
            <div v-for="item in infraItems" :key="item.label" class="infra-card">
              <div class="infra-icon-wrap" :style="{ background: item.iconBg }">
                <v-icon :color="item.iconColor" size="20">{{ item.icon }}</v-icon>
              </div>
              <div class="infra-label">{{ item.label }}</div>
              <div class="infra-val">{{ item.value }}</div>
              <div class="infra-sub" :class="item.subClass">{{ item.sub }}</div>
              <div class="prog-bar" style="margin-top:8px">
                <div class="prog-fill" :style="{ width: item.pct + '%', background: item.barColor }"></div>
              </div>
            </div>
          </div>
          <div class="infra-chart-row">
            <div v-for="(m, i) in costMonths" :key="m.month" class="infra-chart-col">
              <div class="infra-bar-wrap">
                <div class="infra-bar" :style="{ height: m.pct + '%', animationDelay: i * 60 + 'ms' }">
                  <div class="infra-bar-tip">${{ m.cost }}k</div>
                </div>
              </div>
              <div class="infra-month">{{ m.month }}</div>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div v-else-if="tab === 'security'" class="cto-tab-body">
          <div class="sec-list">
            <div v-for="(v, i) in vulns" :key="i" class="sec-row">
              <div class="sec-sev-dot" :style="{ background: v.color }"></div>
              <div class="sec-body">
                <div class="sec-title">{{ v.title }}</div>
                <div class="sec-sub">{{ v.subtitle }}</div>
              </div>
              <span class="sec-badge" :style="{ background: v.badgeBg, color: v.color }">{{ v.severity }}</span>
              <button class="sec-action-btn" :style="{ color: v.color, borderColor: v.color }">{{ v.action }}</button>
            </div>
          </div>
          <div class="sec-summary">
            <div v-for="s in secSummary" :key="s.label" class="sec-sum-card" :style="{ '--sc': s.color }">
              <div class="sec-sum-val" :style="{ color: s.color }">{{ s.count }}</div>
              <div class="sec-sum-label">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <!-- Tech Debt -->
        <div v-else class="cto-tab-body">
          <div class="debt-grid">
            <div v-for="d in debtItems" :key="d.label" class="debt-card">
              <div class="debt-header">
                <div class="debt-icon-wrap" :style="{ background: d.iconBg }">
                  <v-icon :color="d.iconColor" size="18">{{ d.icon }}</v-icon>
                </div>
                <span class="debt-rating" :style="{ color: d.ratingColor }">{{ d.rating }}</span>
              </div>
              <div class="debt-label">{{ d.label }}</div>
              <div class="debt-val">{{ d.value }}</div>
              <div class="prog-bar" style="margin-top:8px">
                <div class="prog-fill" :style="{ width: d.pct + '%', background: d.ratingColor }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tab = ref('infrastructure')

const tabLabels: Record<string, string> = {
  infrastructure: 'Infrastructure Cost',
  security:       'Security Vulnerabilities',
  techdebt:       'Tech Debt',
}

const metrics = [
  { label: 'System Uptime', value: '99.99%', icon: 'mdi-server',         iconColor: '#10b981', iconBg: '#f0fdf4', accent: '#10b981', pct: 99, trend: '+0.04%',   trendUp: true  },
  { label: 'API Latency',   value: '45ms',   icon: 'mdi-lightning-bolt', iconColor: '#4f46e5', iconBg: '#eef2ff', accent: '#4f46e5', pct: 55, trend: '-12%',     trendUp: true  },
  { label: 'Error Rate',    value: '0.02%',  icon: 'mdi-alert-circle',   iconColor: '#ef4444', iconBg: '#fef2f2', accent: '#ef4444', pct: 2,  trend: '+0.01%',   trendUp: false },
  { label: 'Deployments',   value: '14',     icon: 'mdi-rocket-launch',  iconColor: '#06b6d4', iconBg: '#ecfeff', accent: '#06b6d4', pct: 70, trend: '+3 today', trendUp: true  },
]

const teams = [
  { name: 'Core Platform',       initials: 'CP', members: 6, sprint: 'On track',       velocity: 45, progress: 85, delta: '+5', deltaUp: true,  hex: '#4f46e5', avatarBg: '#eef2ff', avatarColor: '#4f46e5', sparkPoints: '0,18 10,14 20,16 30,10 40,12 50,6 60,8',   sparkLastX: 60, sparkLastY: 8  },
  { name: 'Frontend Experience', initials: 'FE', members: 5, sprint: 'Below capacity', velocity: 32, progress: 60, delta: '-4', deltaUp: false, hex: '#06b6d4', avatarBg: '#ecfeff', avatarColor: '#06b6d4', sparkPoints: '0,10 10,12 20,14 30,16 40,18 50,20 60,18', sparkLastX: 60, sparkLastY: 18 },
  { name: 'Mobile App',          initials: 'MA', members: 4, sprint: 'On track',       velocity: 28, progress: 75, delta: '+2', deltaUp: true,  hex: '#10b981', avatarBg: '#f0fdf4', avatarColor: '#10b981', sparkPoints: '0,16 10,14 20,12 30,14 40,10 50,8 60,10',  sparkLastX: 60, sparkLastY: 10 },
  { name: 'Data Engineering',    initials: 'DE', members: 5, sprint: 'Ahead',          velocity: 38, progress: 90, delta: '+8', deltaUp: true,  hex: '#a855f7', avatarBg: '#faf5ff', avatarColor: '#a855f7', sparkPoints: '0,20 10,16 20,14 30,10 40,8 50,6 60,4',   sparkLastX: 60, sparkLastY: 4  },
]

const totalVelocity = teams.reduce((s, t) => s + t.velocity, 0)
const totalProgress = Math.round(teams.reduce((s, t) => s + t.progress, 0) / teams.length)

const infraItems = [
  { label: 'AWS Compute',   value: '$5.2k',  sub: '+8% MoM',      subClass: 'sub-warn', pct: 72, barColor: '#4f46e5', icon: 'mdi-server',       iconColor: '#4f46e5', iconBg: '#eef2ff' },
  { label: 'Storage & CDN', value: '$2.1k',  sub: 'Stable',       subClass: 'sub-ok',   pct: 42, barColor: '#10b981', icon: 'mdi-database',     iconColor: '#10b981', iconBg: '#f0fdf4' },
  { label: 'Networking',    value: '$1.8k',  sub: '-3% MoM',      subClass: 'sub-ok',   pct: 35, barColor: '#06b6d4', icon: 'mdi-lan',          iconColor: '#06b6d4', iconBg: '#ecfeff' },
  { label: 'Monitoring',    value: '$1.3k',  sub: 'On budget',    subClass: 'sub-ok',   pct: 26, barColor: '#a855f7', icon: 'mdi-chart-line',   iconColor: '#a855f7', iconBg: '#faf5ff' },
  { label: 'Total Spend',   value: '$12.4k', sub: 'Forecast $14k',subClass: 'sub-warn', pct: 88, barColor: '#f59e0b', icon: 'mdi-currency-usd', iconColor: '#f59e0b', iconBg: '#fffbeb' },
]

const costMonths = [
  { month: 'Oct', cost: 9.8,  pct: 70 },
  { month: 'Nov', cost: 10.2, pct: 73 },
  { month: 'Dec', cost: 11.0, pct: 79 },
  { month: 'Jan', cost: 10.8, pct: 77 },
  { month: 'Feb', cost: 11.9, pct: 85 },
  { month: 'Mar', cost: 12.4, pct: 89 },
]

const vulns = [
  { title: 'Critical: Log4j CVE Variant',   subtitle: 'Detected in Legacy Auth Service', severity: 'Critical', color: '#ef4444', badgeBg: '#fef2f2', action: 'Patch Now' },
  { title: 'Medium: Outdated Dependency',   subtitle: 'Lodash < 4.17.21 in 3 services',  severity: 'Medium',   color: '#f59e0b', badgeBg: '#fffbeb', action: 'Schedule'  },
  { title: 'Low: Missing Security Headers', subtitle: 'X-Frame-Options in Admin Panel',  severity: 'Low',      color: '#06b6d4', badgeBg: '#ecfeff', action: 'Auto-fix'  },
  { title: 'Info: Weak TLS Config',         subtitle: 'TLS 1.0 still enabled on legacy', severity: 'Info',     color: '#94a3b8', badgeBg: '#f1f5f9', action: 'Review'    },
]

const secSummary = [
  { label: 'Critical', count: 1, color: '#ef4444' },
  { label: 'Medium',   count: 3, color: '#f59e0b' },
  { label: 'Low',      count: 7, color: '#06b6d4' },
  { label: 'Info',     count: 4, color: '#94a3b8' },
]

const debtItems = [
  { label: 'Code Quality',     value: 'A-',   rating: 'A-', ratingColor: '#10b981', pct: 85, icon: 'mdi-code-braces',          iconColor: '#10b981', iconBg: '#f0fdf4' },
  { label: 'Test Coverage',    value: '74%',  rating: 'B+', ratingColor: '#4f46e5', pct: 74, icon: 'mdi-test-tube',            iconColor: '#4f46e5', iconBg: '#eef2ff' },
  { label: 'Duplication',      value: '4.2%', rating: 'A',  ratingColor: '#10b981', pct: 92, icon: 'mdi-content-copy',         iconColor: '#10b981', iconBg: '#f0fdf4' },
  { label: 'Complexity Index', value: '18',   rating: 'B',  ratingColor: '#f59e0b', pct: 62, icon: 'mdi-graph-outline',        iconColor: '#f59e0b', iconBg: '#fffbeb' },
  { label: 'Open Issues',      value: '142',  rating: 'C+', ratingColor: '#ef4444', pct: 38, icon: 'mdi-alert-circle-outline', iconColor: '#ef4444', iconBg: '#fef2f2' },
]
</script>

<style scoped>
@import '@/styles/dashboard-shared.css';

/* ── CTO grid layout ── */
.cto-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 900px) {
  .cto-grid {
    grid-template-columns: 1fr 300px;
    grid-template-rows: auto auto;
  }
  .cto-health   { grid-column: 1; grid-row: 1; }
  .cto-velocity { grid-column: 2; grid-row: 1; }
  .cto-metrics  { grid-column: 1 / -1; grid-row: 2; }
}

/* ── Health cards ── */
.health-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; padding: 14px; }
@media (min-width: 768px) { .health-grid { grid-template-columns: repeat(4,1fr); } }
.health-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; }
.health-label { font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px; }
.health-val   { font-size:26px; font-weight:700; line-height:1; margin-bottom:4px; }
.health-sub   { font-size:11px; color:#94a3b8; margin-bottom:4px; }
.health-note  { font-size:11px; display:flex; align-items:center; margin-top:8px; }
.success-note { color:#10b981; }
.error-note   { font-size:11px; color:#ef4444; background:#fef2f2; padding:4px 8px; border-radius:6px; display:flex; align-items:center; }
.sparkline-row { display:flex; align-items:flex-end; gap:3px; height:38px; }
.sparkline-bar { width:6px; opacity:.8; border-radius:2px 2px 0 0; }
.mt-2 { margin-top:8px; }
.gap-2 { gap:8px; }

/* ── Team Velocity ── */
.vel-panel { display:flex; flex-direction:column; }
.vel-sprint-badge { font-size:10.5px; font-weight:700; background:#eef2ff; color:#4f46e5; border:1px solid #c7d2fe; padding:2px 9px; border-radius:20px; }
.vel-summary { display:flex; align-items:center; gap:14px; padding:12px 14px 10px; border-bottom:1px solid #f1f5f9; }
.vel-ring-wrap { position:relative; flex-shrink:0; width:78px; height:78px; }
.vel-ring-svg { width:78px; height:78px; }
.vel-ring-arc { transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1); }
.vel-ring-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.vel-ring-val { font-size:17px; font-weight:800; color:#0f172a; line-height:1; }
.vel-ring-lbl { font-size:9px; color:#94a3b8; }
.vel-summary-stats { flex:1; display:flex; align-items:center; }
.vel-stat { flex:1; text-align:center; }
.vel-stat-val { font-size:15px; font-weight:800; color:#0f172a; }
.vel-stat-lbl { font-size:10px; color:#94a3b8; margin-top:2px; }
.vel-stat-divider { width:1px; height:28px; background:#f1f5f9; flex-shrink:0; }
.vel-teams { padding:6px 10px; display:flex; flex-direction:column; gap:2px; }
.vel-team-row { display:flex; align-items:center; gap:8px; padding:8px 6px; border-radius:10px; cursor:pointer; animation:fadeSlideUp .4s ease both; transition:background .15s, transform .15s; }
.vel-team-row:hover { background:#f8fafc; transform:translateX(3px); }
.vel-team-left { display:flex; align-items:center; gap:8px; width:130px; flex-shrink:0; }
.vel-avatar { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:800; flex-shrink:0; transition:transform .2s cubic-bezier(.34,1.56,.64,1); }
.vel-team-row:hover .vel-avatar { transform:rotate(-6deg) scale(1.1); }
.vel-team-name { font-size:11.5px; font-weight:700; color:#0f172a; line-height:1.2; }
.vel-team-meta { font-size:9.5px; color:#94a3b8; margin-top:1px; }
.vel-sparkline { width:56px; flex-shrink:0; }
.vel-spark-svg { width:56px; height:24px; overflow:visible; }
.vel-spark-line { stroke-dasharray:200; stroke-dashoffset:200; animation:spark-draw .9s cubic-bezier(.4,0,.2,1) forwards; }
@keyframes spark-draw { to { stroke-dashoffset:0; } }
.vel-team-right { flex:1; }
.vel-pts-row { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:4px; }
.vel-pts { font-size:15px; font-weight:800; color:#0f172a; }
.vel-pts-unit { font-size:9.5px; font-weight:600; color:#94a3b8; margin-left:2px; }
.vel-delta { font-size:10px; font-weight:700; display:flex; align-items:center; gap:1px; }
.vel-bar-track { height:5px; background:#f1f5f9; border-radius:99px; overflow:hidden; margin-bottom:2px; }
.vel-bar-fill { height:100%; border-radius:99px; animation:vel-bar-grow .7s cubic-bezier(.34,1.2,.64,1) both; }
@keyframes vel-bar-grow { from { width:0 !important; } }
.vel-cap-label { font-size:9.5px; color:#94a3b8; }
.vel-alert { display:flex; align-items:flex-start; gap:8px; margin:4px 10px 10px; background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:9px 11px; font-size:11px; color:#92400e; line-height:1.5; }
.vel-alert-icon { font-size:13px; flex-shrink:0; margin-top:1px; }
.vel-alert-text strong { font-weight:700; }

/* ── Detailed Metrics tabs ── */
.cto-tab-group { display:flex; gap:4px; }
.cto-tab { font-size:11.5px; font-weight:600; padding:5px 12px; border-radius:7px; border:1px solid transparent; cursor:pointer; background:transparent; color:#94a3b8; transition:all .15s; font-family:'Inter',sans-serif; }
.cto-tab.active { background:#eef2ff; color:#4f46e5; border-color:#c7d2fe; }
.cto-tab:hover:not(.active) { background:#f8fafc; color:#475569; }
.cto-tab-body { padding:16px; animation:fadeSlideUp .3s ease both; }

/* Infrastructure */
.infra-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:14px; }
@media (min-width: 768px) { .infra-grid { grid-template-columns:repeat(5,1fr); } }
.infra-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:13px; transition:box-shadow .2s, transform .2s; }
.infra-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.07); transform:translateY(-2px); }
.infra-icon-wrap { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; margin-bottom:9px; }
.infra-label { font-size:10.5px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.04em; margin-bottom:3px; }
.infra-val   { font-size:20px; font-weight:800; color:#0f172a; line-height:1; margin-bottom:2px; }
.infra-sub   { font-size:11px; font-weight:600; }
.sub-ok   { color:#10b981; }
.sub-warn { color:#f59e0b; }
.infra-chart-row { display:flex; align-items:flex-end; gap:10px; height:90px; padding:0 4px; border-left:1px solid #f1f5f9; border-bottom:1px solid #f1f5f9; }
.infra-chart-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; }
.infra-bar-wrap  { flex:1; width:100%; display:flex; align-items:flex-end; justify-content:center; }
.infra-bar { width:26px; border-radius:5px 5px 0 0; background:linear-gradient(180deg,#6366f1,#4f46e5); position:relative; cursor:pointer; animation:vel-bar-grow .6s cubic-bezier(.34,1.2,.64,1) both; transition:filter .15s; }
.infra-bar:hover { filter:brightness(1.1); }
.infra-bar-tip { position:absolute; bottom:calc(100% + 4px); left:50%; transform:translateX(-50%); background:#0f172a; color:#fff; font-size:10px; font-weight:600; padding:2px 6px; border-radius:4px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .15s; }
.infra-bar:hover .infra-bar-tip { opacity:1; }
.infra-month { font-size:10px; color:#94a3b8; }

/* Security */
.sec-list { display:flex; flex-direction:column; gap:9px; margin-bottom:14px; }
.sec-row { display:flex; align-items:center; gap:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:11px 13px; transition:box-shadow .15s; }
.sec-row:hover { box-shadow:0 3px 12px rgba(0,0,0,.06); }
.sec-sev-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.sec-body { flex:1; }
.sec-title { font-size:12.5px; font-weight:700; color:#0f172a; margin-bottom:2px; }
.sec-sub   { font-size:11px; color:#64748b; }
.sec-badge { font-size:10.5px; font-weight:700; padding:2px 9px; border-radius:20px; flex-shrink:0; }
.sec-action-btn { font-size:11px; font-weight:700; padding:4px 12px; border-radius:7px; border:1px solid; background:transparent; cursor:pointer; font-family:'Inter',sans-serif; transition:opacity .15s; flex-shrink:0; }
.sec-action-btn:hover { opacity:.75; }
.sec-summary { display:flex; gap:12px; }
.sec-sum-card { flex:1; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:13px; text-align:center; border-top:3px solid var(--sc); transition:transform .2s; }
.sec-sum-card:hover { transform:translateY(-2px); }
.sec-sum-val   { font-size:24px; font-weight:800; line-height:1; margin-bottom:4px; }
.sec-sum-label { font-size:11px; color:#64748b; font-weight:600; }

/* Tech Debt */
.debt-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
@media (min-width: 768px) { .debt-grid { grid-template-columns:repeat(5,1fr); } }
.debt-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:13px; transition:box-shadow .2s, transform .2s; }
.debt-card:hover { box-shadow:0 4px 16px rgba(0,0,0,.07); transform:translateY(-2px); }
.debt-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:9px; }
.debt-icon-wrap { width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center; }
.debt-rating { font-size:17px; font-weight:800; }
.debt-label { font-size:10.5px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.04em; margin-bottom:3px; }
.debt-val   { font-size:20px; font-weight:800; color:#0f172a; line-height:1; }

@keyframes fadeSlideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
</style>
