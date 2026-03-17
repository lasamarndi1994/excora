<template>
  <div class="ceo-dash" ref="dashRef">

    <!-- ── Hero Header ── -->
    <div class="ceo-header">
      <div class="ceo-header-left">
        <div class="ceo-badge">Executive Overview</div>
        <h1 class="ceo-title">CEO Dashboard</h1>
        <p class="ceo-sub">Strategic metrics, growth signals &amp; company health — Q1 2026</p>
      </div>
      <div class="ceo-header-right">
        <div class="live-dot-wrap"><span class="live-dot"></span><span class="live-label">Live</span></div>
        <button class="action-btn"><v-icon size="13" class="mr-1">mdi-download</v-icon>Export Report</button>
      </div>
    </div>

    <!-- ── Ticker ── -->
    <div class="ticker-wrap">
      <div class="ticker-track">
        <span v-for="(t, i) in [...ticker, ...ticker]" :key="i" class="ticker-item">
          <v-icon size="11" :color="t.up ? '#10b981' : '#ef4444'">{{ t.up ? 'mdi-arrow-up' : 'mdi-arrow-down' }}</v-icon>
          <span class="ticker-name">{{ t.name }}</span>
          <span class="ticker-val" :class="t.up ? 'tick-up' : 'tick-down'">{{ t.val }}</span>
          <span class="ticker-sep">·</span>
        </span>
      </div>
    </div>

    <!-- ── KPI Cards ── -->
    <div class="kpi-row">
      <div v-for="(k, i) in kpis" :key="k.label" class="kpi-card" :style="{ '--kc': k.accent, animationDelay: i * 80 + 'ms' }">
        <div class="kpi-top">
          <div class="kpi-icon-wrap" :style="{ background: k.iconBg }">
            <v-icon :color="k.iconColor" size="20">{{ k.icon }}</v-icon>
          </div>
          <span class="kpi-badge" :class="k.up ? 'badge-up' : 'badge-down'">
            <v-icon size="10">{{ k.up ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>{{ k.trend }}
          </span>
        </div>
        <div class="kpi-val">{{ k.value }}</div>
        <div class="kpi-label">{{ k.label }}</div>
        <div class="kpi-bar-track"><div class="kpi-bar-fill" :style="{ width: k.pct + '%', background: k.accent }"></div></div>
        <div class="kpi-sub">{{ k.sub }}</div>
        <div class="kpi-glow" :style="{ background: k.accent }"></div>
      </div>
    </div>

    <!-- ── Row 2: Revenue Chart + Org Health + AI Insights ── -->
    <div class="ceo-grid-3 mb-14">

      <!-- Revenue Chart -->
      <div class="panel ceo-panel-lg">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#4f46e5"></div>
            <span class="panel-title">Revenue Overview</span>
          </div>
          <div class="chart-tabs">
            <button v-for="t in ['MRR','ARR','Forecast']" :key="t"
              class="chart-tab" :class="{ active: revenueTab === t }" @click="revenueTab = t">{{ t }}</button>
          </div>
        </div>
        <div class="chart-area">
          <div class="chart-y-labels">
            <span v-for="l in yLabels" :key="l">{{ l }}</span>
          </div>
          <div class="chart-bars-wrap">
            <div v-for="(m, i) in revenueMonths" :key="m.month" class="chart-col">
              <div class="chart-bar-group">
                <div class="chart-bar bar-prev" :style="{ height: m.prev + '%' }" :title="`Prev: $${m.prev}k`"></div>
                <div class="chart-bar bar-curr" :style="{ height: m.curr + '%', animationDelay: i * 60 + 'ms' }" :title="`Curr: $${m.curr}k`">
                  <div class="bar-tooltip">${{ m.curr }}k</div>
                </div>
              </div>
              <div class="chart-month">{{ m.month }}</div>
            </div>
          </div>
        </div>
        <div class="chart-legend">
          <span class="legend-dot" style="background:#4f46e5"></span><span>2026</span>
          <span class="legend-dot" style="background:#e2e8f0; margin-left:12px;"></span><span>2025</span>
          <span class="legend-sep"></span>
          <span class="legend-highlight">Total YTD: <strong>$8.4M</strong></span>
          <span class="legend-highlight ml-12">Target: <strong>$10M</strong></span>
        </div>
      </div>

      <!-- Org Health Ring -->
      <div class="panel ceo-panel-sm">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#10b981"></div>
            <span class="panel-title">Org Health</span>
          </div>
        </div>
        <div class="ring-wrap">
          <svg class="ring-svg" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" stroke-width="12"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="url(#ringGrad)" stroke-width="12"
              stroke-linecap="round" stroke-dasharray="314" :stroke-dashoffset="314 - (314 * orgHealth / 100)"
              class="ring-progress" transform="rotate(-90 60 60)"/>
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#10b981"/>
                <stop offset="100%" stop-color="#06b6d4"/>
              </linearGradient>
            </defs>
          </svg>
          <div class="ring-center">
            <div class="ring-val">{{ orgHealth }}%</div>
            <div class="ring-lbl">Health Score</div>
          </div>
        </div>
        <div class="health-items">
          <div v-for="h in healthItems" :key="h.label" class="health-item">
            <div class="health-item-left">
              <span class="health-dot" :style="{ background: h.color }"></span>
              <span class="health-item-label">{{ h.label }}</span>
            </div>
            <div class="health-item-right">
              <span class="health-item-val">{{ h.val }}</span>
              <div class="health-mini-bar"><div class="health-mini-fill" :style="{ width: h.pct + '%', background: h.color }"></div></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Row 3: AI Insights + Global Expansion + Pipeline ── -->
    <div class="ceo-grid-3b mb-14">

      <!-- AI Insights -->
      <div class="panel">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot ai-pulse" style="background:#a855f7"></div>
            <span class="panel-title">AI Strategic Insights</span>
          </div>
          <span class="ai-badge">GPT-4o</span>
        </div>
        <div v-for="(ins, i) in insights" :key="i" class="insight-row" :class="{ 'insight-row--last': i === insights.length - 1 }">
          <div class="insight-icon" :style="{ background: ins.bg }">
            <v-icon :color="ins.color" size="16">{{ ins.icon }}</v-icon>
          </div>
          <div class="insight-body">
            <div class="insight-title">{{ ins.title }}</div>
            <div class="insight-desc">{{ ins.description }}</div>
          </div>
          <span class="ins-priority" :class="`ins-${ins.priority}`">{{ ins.priority }}</span>
        </div>
      </div>

      <!-- Global Expansion -->
      <div class="panel">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#10b981"></div>
            <span class="panel-title">Global Expansion</span>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Region</th><th>Status</th><th>Growth</th><th class="text-right">ARR</th></tr></thead>
            <tbody>
              <tr v-for="r in regions" :key="r.name">
                <td class="font-medium">
                  <span class="region-flag">{{ r.flag }}</span> {{ r.name }}
                </td>
                <td><span class="status-chip" :class="`chip-${r.chipClass}`">{{ r.status }}</span></td>
                <td>
                  <div class="region-bar-track">
                    <div class="region-bar-fill" :style="{ width: r.growthPct + '%', background: r.barColor }"></div>
                  </div>
                  <span class="region-growth" :class="r.growthUp ? 'tick-up' : 'tick-down'">{{ r.growth }}</span>
                </td>
                <td class="text-right font-medium">{{ r.arr }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="view-all-wrap"><button class="view-all-btn">View Full Report</button></div>
      </div>

    </div>

    <!-- ── Row 4: Sales Pipeline + Team Sentiment + Recent Decisions ── -->
    <div class="ceo-grid-3c">

      <!-- Sales Pipeline -->
      <div class="panel">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#f59e0b"></div>
            <span class="panel-title">Sales Pipeline</span>
          </div>
          <span class="panel-sub-badge">$3.2M open</span>
        </div>
        <div class="pipeline-wrap">
          <div v-for="(stage, i) in pipeline" :key="stage.name" class="pipeline-stage">
            <div class="pipeline-label-row">
              <span class="pipeline-name">{{ stage.name }}</span>
              <span class="pipeline-count">{{ stage.count }} deals · {{ stage.value }}</span>
            </div>
            <div class="pipeline-track">
              <div class="pipeline-fill" :style="{ width: stage.pct + '%', background: stage.color, animationDelay: i * 100 + 'ms' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Sentiment -->
      <div class="panel">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#ec4899"></div>
            <span class="panel-title">Team Sentiment</span>
          </div>
          <span class="sentiment-score">eNPS: <strong>+42</strong></span>
        </div>
        <div class="sentiment-wrap">
          <div v-for="s in sentiment" :key="s.label" class="sentiment-row">
            <span class="sentiment-emoji">{{ s.emoji }}</span>
            <span class="sentiment-label">{{ s.label }}</span>
            <div class="sentiment-track">
              <div class="sentiment-fill" :style="{ width: s.pct + '%', background: s.color }"></div>
            </div>
            <span class="sentiment-pct">{{ s.pct }}%</span>
          </div>
        </div>
        <div class="sentiment-note">
          <v-icon size="13" color="#ec4899" class="mr-1">mdi-information-outline</v-icon>
          Based on last quarterly pulse survey · 94% response rate
        </div>
      </div>

      <!-- Recent Decisions -->
      <div class="panel">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#06b6d4"></div>
            <span class="panel-title">Recent Decisions</span>
          </div>
        </div>
        <div v-for="(d, i) in decisions" :key="i" class="decision-row" :class="{ 'decision-row--last': i === decisions.length - 1 }">
          <div class="decision-icon" :style="{ background: d.bg }">
            <v-icon :color="d.color" size="15">{{ d.icon }}</v-icon>
          </div>
          <div class="decision-body">
            <div class="decision-title">{{ d.title }}</div>
            <div class="decision-meta">{{ d.date }} · {{ d.owner }}</div>
          </div>
          <span class="decision-status" :class="`ds-${d.status}`">{{ d.status }}</span>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const revenueTab = ref('MRR')
const orgHealth = ref(87)

const ticker = [
  { name: 'MRR',        val: '$700K',  up: true  },
  { name: 'CAC',        val: '$142',   up: false },
  { name: 'LTV',        val: '$4.8K',  up: true  },
  { name: 'Churn',      val: '2.1%',   up: false },
  { name: 'NPS',        val: '72',     up: true  },
  { name: 'Uptime',     val: '99.99%', up: true  },
  { name: 'Open Deals', val: '38',     up: true  },
]

const kpis = [
  { label: 'Total Revenue',   value: '$8.4M',  icon: 'mdi-currency-usd',       iconColor: '#4f46e5', iconBg: '#eef2ff', accent: '#4f46e5', pct: 84, trend: '+12.5%', up: true,  sub: '$700K MRR · on track' },
  { label: 'Active Users',    value: '124K',   icon: 'mdi-account-group',       iconColor: '#10b981', iconBg: '#f0fdf4', accent: '#10b981', pct: 68, trend: '+8.2%',  up: true,  sub: '3.2K new this week' },
  { label: 'Gross Margin',    value: '71%',    icon: 'mdi-percent-outline',     iconColor: '#06b6d4', iconBg: '#ecfeff', accent: '#06b6d4', pct: 71, trend: '+2.1%',  up: true,  sub: 'Target: 75%' },
  { label: 'Churn Rate',      value: '2.1%',   icon: 'mdi-chart-line-variant',  iconColor: '#ef4444', iconBg: '#fef2f2', accent: '#ef4444', pct: 21, trend: '-0.5%',  up: false, sub: 'Industry avg: 3.5%' },
  { label: 'NPS Score',       value: '72',     icon: 'mdi-star-outline',        iconColor: '#f59e0b', iconBg: '#fffbeb', accent: '#f59e0b', pct: 72, trend: '+4pts',  up: true,  sub: 'World-class: >70' },
  { label: 'Open Pipeline',   value: '$3.2M',  icon: 'mdi-filter-outline',      iconColor: '#a855f7', iconBg: '#faf5ff', accent: '#a855f7', pct: 64, trend: '+18%',   up: true,  sub: '38 active deals' },
]

const yLabels = ['$900k', '$600k', '$300k', '$0']

const revenueMonths = [
  { month: 'Oct', prev: 55, curr: 62 },
  { month: 'Nov', prev: 60, curr: 70 },
  { month: 'Dec', prev: 65, curr: 75 },
  { month: 'Jan', prev: 58, curr: 80 },
  { month: 'Feb', prev: 62, curr: 85 },
  { month: 'Mar', prev: 70, curr: 93 },
]

const healthItems = [
  { label: 'Employee Retention', val: '94%', pct: 94, color: '#10b981' },
  { label: 'Sprint Velocity',    val: '88%', pct: 88, color: '#4f46e5' },
  { label: 'Customer Sat.',      val: '91%', pct: 91, color: '#06b6d4' },
  { label: 'Delivery On-Time',   val: '79%', pct: 79, color: '#f59e0b' },
]

const insights = [
  { title: 'Expansion Opportunity',  description: 'APAC user growth +34% MoM — consider dedicated infra node.',   icon: 'mdi-earth',             color: '#4f46e5', bg: '#eef2ff', priority: 'high'   },
  { title: 'Cost Optimization',      description: 'Cloud spend reducible by 15% via reserved instance migration.', icon: 'mdi-cloud-off-outline',  color: '#10b981', bg: '#f0fdf4', priority: 'medium' },
  { title: 'Competitor Alert',       description: 'New entrant pricing 20% below standard in enterprise tier.',    icon: 'mdi-shield-alert',       color: '#ef4444', bg: '#fef2f2', priority: 'high'   },
  { title: 'Upsell Signal',          description: '12 accounts showing high-usage patterns — prime for upgrade.',  icon: 'mdi-arrow-up-circle',    color: '#f59e0b', bg: '#fffbeb', priority: 'medium' },
]

const regions = [
  { name: 'North America', flag: '🇺🇸', status: 'Active',    chipClass: 'success', arr: '$4.2M', growth: '+14%', growthPct: 80, growthUp: true,  barColor: '#10b981' },
  { name: 'Europe',        flag: '🇪🇺', status: 'Expanding', chipClass: 'info',    arr: '$2.1M', growth: '+22%', growthPct: 60, growthUp: true,  barColor: '#4f46e5' },
  { name: 'Asia Pacific',  flag: '🌏', status: 'Planning',  chipClass: 'warning', arr: '$1.5M', growth: '+34%', growthPct: 45, growthUp: true,  barColor: '#f59e0b' },
  { name: 'South America', flag: '🌎', status: 'Research',  chipClass: 'grey',    arr: '$600K', growth: '+5%',  growthPct: 20, growthUp: true,  barColor: '#94a3b8' },
]

const pipeline = [
  { name: 'Prospecting',  count: 14, value: '$840K',  pct: 90, color: '#e2e8f0' },
  { name: 'Qualified',    count: 10, value: '$620K',  pct: 70, color: '#c7d2fe' },
  { name: 'Proposal',     count: 8,  value: '$510K',  pct: 55, color: '#818cf8' },
  { name: 'Negotiation',  count: 4,  value: '$780K',  pct: 35, color: '#4f46e5' },
  { name: 'Closed Won',   count: 2,  value: '$450K',  pct: 18, color: '#10b981' },
]

const sentiment = [
  { label: 'Thriving',    emoji: '😄', pct: 52, color: '#10b981' },
  { label: 'Satisfied',   emoji: '🙂', pct: 31, color: '#06b6d4' },
  { label: 'Neutral',     emoji: '😐', pct: 11, color: '#f59e0b' },
  { label: 'Disengaged',  emoji: '😔', pct: 6,  color: '#ef4444' },
]

const decisions = [
  { title: 'Approve Q2 Hiring Plan (+18 headcount)',  date: 'Mar 12', owner: 'CEO + Board',  icon: 'mdi-account-plus',      color: '#4f46e5', bg: '#eef2ff', status: 'approved' },
  { title: 'Expand APAC Infrastructure Budget',       date: 'Mar 10', owner: 'CTO + CFO',   icon: 'mdi-server-plus',       color: '#10b981', bg: '#f0fdf4', status: 'approved' },
  { title: 'Enterprise Pricing Revision',             date: 'Mar 08', owner: 'CEO + Sales',  icon: 'mdi-tag-edit-outline',  color: '#f59e0b', bg: '#fffbeb', status: 'pending'  },
  { title: 'Acquire Competitor Analytics Tool',       date: 'Mar 05', owner: 'CEO + Legal',  icon: 'mdi-handshake-outline', color: '#a855f7', bg: '#faf5ff', status: 'review'   },
]
</script>

<style scoped>
@import '@/styles/dashboard-shared.css';

/* ── Page ── */
.ceo-dash {
  padding: 14px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #1e293b;
  background: #f8fafc;
  min-height: 100%;
}
@media (min-width: 768px) { .ceo-dash { padding: 22px 26px; } }

/* ── Header ── */
.ceo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 14px;
  animation: fadeSlideDown .5s ease both;
}
.ceo-header-left { display: flex; flex-direction: column; gap: 4px; }
.ceo-badge {
  display: inline-flex; align-items: center;
  background: linear-gradient(135deg, #eef2ff, #faf5ff);
  color: #6d28d9; font-size: 10.5px; font-weight: 700;
  padding: 3px 10px; border-radius: 20px;
  border: 1px solid #ddd6fe;
  letter-spacing: .04em; text-transform: uppercase;
  width: fit-content; margin-bottom: 4px;
}
.ceo-title {
  font-size: 22px; font-weight: 800; color: #0f172a;
  margin: 0; letter-spacing: -.3px;
  background: linear-gradient(120deg, #0f172a 60%, #4f46e5);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.ceo-sub { font-size: 12.5px; color: #64748b; margin: 0; }
.ceo-header-right { display: flex; align-items: center; gap: 12px; }
.live-dot-wrap { display: flex; align-items: center; gap: 6px; }
.live-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #10b981;
  box-shadow: 0 0 0 0 rgba(16,185,129,.4);
  animation: pulse-ring 1.8s ease infinite;
}
.live-label { font-size: 11px; font-weight: 600; color: #10b981; }
@keyframes pulse-ring {
  0%   { box-shadow: 0 0 0 0 rgba(16,185,129,.5); }
  70%  { box-shadow: 0 0 0 7px rgba(16,185,129,0); }
  100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
}

/* ── Ticker ── */
.ticker-wrap {
  overflow: hidden; background: #fff; border: 1px solid #e2e8f0;
  border-radius: 10px; margin-bottom: 16px;
  animation: fadeSlideDown .5s .1s ease both;
}
.ticker-track {
  display: flex; white-space: nowrap;
  animation: ticker-scroll 28s linear infinite;
  padding: 8px 0;
}
.ticker-track:hover { animation-play-state: paused; }
@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.ticker-item { display: inline-flex; align-items: center; gap: 4px; padding: 0 16px; font-size: 12px; }
.ticker-name { font-weight: 600; color: #475569; }
.ticker-val  { font-weight: 700; }
.ticker-sep  { color: #cbd5e1; }
.tick-up   { color: #10b981; }
.tick-down { color: #ef4444; }

/* ── KPI Cards ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
@media (min-width: 640px) { .kpi-row { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { .kpi-row { grid-template-columns: repeat(6, 1fr); } }
.kpi-card {
  position: relative; background: #fff;
  border: 1px solid #e2e8f0; border-radius: 14px;
  padding: 16px 16px 12px; overflow: hidden;
  cursor: default;
  animation: fadeSlideUp .45s ease both;
  transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s, border-color .2s;
}
.kpi-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 14px 36px rgba(0,0,0,.10);
  border-color: var(--kc);
}
.kpi-card:hover .kpi-glow { opacity: .09; transform: scale(1.5); }
.kpi-card:hover .kpi-icon-wrap { transform: rotate(-8deg) scale(1.1); }
.kpi-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
.kpi-icon-wrap {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  transition: transform .3s cubic-bezier(.34,1.56,.64,1);
}
.kpi-badge {
  font-size: 10px; font-weight: 700; padding: 2px 7px;
  border-radius: 20px; display: flex; align-items: center; gap: 2px;
}
.badge-up   { background: #f0fdf4; color: #16a34a; }
.badge-down { background: #fef2f2; color: #ef4444; }
.kpi-val { font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 3px; }
.kpi-label { font-size: 11px; color: #64748b; margin-bottom: 8px; }
.kpi-bar-track { height: 3px; background: #f1f5f9; border-radius: 99px; margin-bottom: 8px; overflow: hidden; }
.kpi-bar-fill { height: 100%; border-radius: 99px; transition: width .8s cubic-bezier(.4,0,.2,1); }
.kpi-sub { font-size: 10.5px; color: #94a3b8; }
.kpi-glow {
  position: absolute; bottom: -30px; right: -30px;
  width: 90px; height: 90px; border-radius: 50%;
  opacity: 0; transition: opacity .3s, transform .3s; pointer-events: none;
}

/* ── Grids ── */
.ceo-grid-3  { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
@media (min-width: 900px) { .ceo-grid-3 { grid-template-columns: 1fr 280px; } }
.ceo-grid-3b { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
@media (min-width: 768px) { .ceo-grid-3b { grid-template-columns: 1fr 1fr; } }
.ceo-grid-3c { display: grid; grid-template-columns: 1fr; gap: 14px; align-items: start; }
@media (min-width: 768px) { .ceo-grid-3c { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1100px) { .ceo-grid-3c { grid-template-columns: 1fr 1fr 1fr; } }
.mb-14 { margin-bottom: 14px; }

/* ── Revenue Chart ── */
.chart-tabs { display: flex; gap: 4px; }
.chart-tab {
  font-size: 11px; font-weight: 600; padding: 4px 10px;
  border-radius: 6px; border: 1px solid transparent;
  cursor: pointer; background: transparent; color: #94a3b8;
  transition: all .15s;
}
.chart-tab.active { background: #eef2ff; color: #4f46e5; border-color: #c7d2fe; }
.chart-tab:hover:not(.active) { background: #f8fafc; color: #475569; }

.chart-area {
  display: flex; gap: 8px; padding: 16px 16px 0;
  height: 180px;
}
.chart-y-labels {
  display: flex; flex-direction: column; justify-content: space-between;
  font-size: 10px; color: #94a3b8; text-align: right;
  padding-bottom: 20px; min-width: 38px;
}
.chart-bars-wrap {
  flex: 1; display: flex; align-items: flex-end; gap: 8px;
  border-left: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;
  padding: 0 8px;
}
.chart-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.chart-bar-group { display: flex; align-items: flex-end; gap: 3px; width: 100%; justify-content: center; }
.chart-bar {
  width: 12px; border-radius: 4px 4px 0 0;
  position: relative; cursor: pointer;
  transition: filter .15s;
}
.chart-bar:hover { filter: brightness(1.1); }
.bar-prev { background: #e2e8f0; }
.bar-curr {
  background: linear-gradient(180deg, #6366f1, #4f46e5);
  animation: bar-grow .6s cubic-bezier(.34,1.2,.64,1) both;
}
@keyframes bar-grow {
  from { transform: scaleY(0); transform-origin: bottom; }
  to   { transform: scaleY(1); transform-origin: bottom; }
}
.bar-tooltip {
  position: absolute; bottom: calc(100% + 4px); left: 50%;
  transform: translateX(-50%);
  background: #0f172a; color: #fff; font-size: 10px; font-weight: 600;
  padding: 3px 6px; border-radius: 5px; white-space: nowrap;
  opacity: 0; pointer-events: none; transition: opacity .15s;
}
.chart-bar:hover .bar-tooltip { opacity: 1; }
.chart-month { font-size: 10px; color: #94a3b8; margin-top: 4px; }
.chart-legend {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 16px 14px; font-size: 11.5px; color: #64748b;
}
.legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.legend-sep { flex: 1; }
.legend-highlight { font-size: 11.5px; color: #475569; }
.legend-highlight strong { color: #0f172a; }
.ml-12 { margin-left: 12px; }

/* ── Org Health Ring ── */
.ring-wrap { position: relative; display: flex; justify-content: center; padding: 16px 0 8px; }
.ring-svg { width: 130px; height: 130px; }
.ring-progress { transition: stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1); }
.ring-center {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.ring-val { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1; }
.ring-lbl { font-size: 10px; color: #64748b; margin-top: 2px; }
.health-items { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 10px; }
.health-item { display: flex; align-items: center; justify-content: space-between; }
.health-item-left { display: flex; align-items: center; gap: 7px; }
.health-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.health-item-label { font-size: 11.5px; color: #475569; }
.health-item-right { display: flex; align-items: center; gap: 8px; }
.health-item-val { font-size: 11.5px; font-weight: 700; color: #0f172a; min-width: 30px; text-align: right; }
.health-mini-bar { width: 60px; height: 4px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.health-mini-fill { height: 100%; border-radius: 99px; transition: width .8s cubic-bezier(.4,0,.2,1); }

/* ── AI Insights ── */
.ai-pulse { animation: ai-blink 2s ease infinite; }
@keyframes ai-blink {
  0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(168,85,247,.5); }
  50%      { opacity: .7; box-shadow: 0 0 0 5px rgba(168,85,247,0); }
}
.ai-badge {
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  background: linear-gradient(135deg, #faf5ff, #eef2ff);
  color: #7c3aed; border: 1px solid #ddd6fe; border-radius: 20px;
}
.ins-priority { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
.ins-high   { background: #fef2f2; color: #ef4444; }
.ins-medium { background: #fffbeb; color: #d97706; }
.ins-low    { background: #f0fdf4; color: #16a34a; }

/* ── Region bars ── */
.region-bar-track { height: 4px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-bottom: 2px; width: 70px; }
.region-bar-fill  { height: 100%; border-radius: 99px; transition: width .7s cubic-bezier(.4,0,.2,1); }
.region-growth { font-size: 10.5px; font-weight: 700; }
.region-flag { font-size: 14px; }

/* ── Pipeline ── */
.pipeline-wrap { padding: 14px 16px; display: flex; flex-direction: column; gap: 12px; }
.pipeline-label-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
.pipeline-name  { font-size: 12px; font-weight: 600; color: #0f172a; }
.pipeline-count { font-size: 11px; color: #64748b; }
.pipeline-track { height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.pipeline-fill  {
  height: 100%; border-radius: 99px;
  animation: bar-grow .7s cubic-bezier(.34,1.2,.64,1) both;
}
.panel-sub-badge {
  font-size: 11px; font-weight: 700; color: #f59e0b;
  background: #fffbeb; border: 1px solid #fde68a;
  padding: 2px 9px; border-radius: 20px;
}

/* ── Sentiment ── */
.sentiment-wrap { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
.sentiment-row { display: flex; align-items: center; gap: 8px; }
.sentiment-emoji { font-size: 16px; width: 22px; text-align: center; }
.sentiment-label { font-size: 12px; font-weight: 500; color: #475569; width: 72px; }
.sentiment-track { flex: 1; height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.sentiment-fill  { height: 100%; border-radius: 99px; transition: width .8s cubic-bezier(.4,0,.2,1); }
.sentiment-pct   { font-size: 11px; font-weight: 700; color: #0f172a; min-width: 28px; text-align: right; }
.sentiment-score { font-size: 12px; color: #64748b; }
.sentiment-score strong { color: #ec4899; }
.sentiment-note  { padding: 10px 16px 14px; font-size: 11px; color: #94a3b8; display: flex; align-items: center; border-top: 1px solid #f1f5f9; }

/* ── Decisions ── */
.decision-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-bottom: 1px solid #f8fafc;
  cursor: pointer; transition: background .12s; position: relative;
}
.decision-row--last { border-bottom: none; }
.decision-row:hover { background: #f8fafc; }
.decision-row::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; background: #06b6d4; border-radius: 0 3px 3px 0;
  opacity: 0; transition: opacity .15s;
}
.decision-row:hover::before { opacity: 1; }
.decision-icon {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.decision-body { flex: 1; min-width: 0; }
.decision-title { font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 2px; line-height: 1.4; }
.decision-meta  { font-size: 10.5px; color: #94a3b8; }
.decision-status { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
.ds-approved { background: #f0fdf4; color: #16a34a; }
.ds-pending  { background: #fffbeb; color: #d97706; }
.ds-review   { background: #eff6ff; color: #2563eb; }

/* ── Entrance animations ── */
@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
