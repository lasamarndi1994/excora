<template>
  <div class="landing-page">
    <!-- Navbar -->
    <v-app-bar color="transparent" flat class="px-md-16 px-4 pt-4 backdrop-blur" absolute>
      <v-avatar color="primary" class="mr-3" rounded="lg">
        <v-icon color="white">mdi-checkbox-marked-circle-outline</v-icon>
      </v-avatar>
      <span class="text-h6 font-weight-bold text-primary">Execora</span>

      <v-spacer></v-spacer>

      <div class="d-none d-md-flex">
        <v-btn variant="text" class="text-capitalize mx-1 font-weight-medium">Features</v-btn>
        <v-btn variant="text" class="text-capitalize mx-1 font-weight-medium">Solutions</v-btn>

      </div>

      <v-btn color="primary" variant="flat" rounded="lg" class="ml-4 px-6 font-weight-bold" to="/auth/login">
        Login
      </v-btn>
    </v-app-bar>

    <!-- Hero Section -->
    <v-container fluid class="hero-section d-flex align-center position-relative overflow-hidden">
      <div class="bg-shape-1"></div>
      <div class="bg-shape-2"></div>

      <v-container class="position-relative z-10">
        <v-row align="center" justify="space-between">
          <v-col cols="12" md="6" class="py-10">
            <v-chip color="primary" variant="tonal" label class="mb-6 font-weight-bold px-4" size="default"
              style="border-radius: 8px;">
              ✨ The #1 Software Development Tool
            </v-chip>
            <h1 class="text-h3 text-md-h2 font-weight-black  text-high-emphasis mb-4 leading-tight display-large">
              Move fast, <br>
              <span class="text-gradient">stay aligned</span>, <br>
              and build better.
            </h1>
            <p class="text-body-1 text-md-h6 text-medium-emphasis mb-8" style="max-width: 480px; line-height: 1.6;">
              The only project management tool you need to plan, track, and release world-class software with zero
              friction.
            </p>

            <div class="d-flex flex-wrap gap-4">
              <v-btn color="primary" size="x-large" rounded="lg" elevation="6" class="px-8 font-weight-bold button-glow"
                to="/board">
                Get Started Free
              </v-btn>
              <v-btn variant="outlined" color="secondary" size="x-large" rounded="lg"
                class="px-8 font-weight-bold bg-surface">
                View Demo
              </v-btn>
            </div>

            <div class="mt-10 d-flex align-center text-medium-emphasis text-body-2">
              <div class="d-flex mr-6 align-center">
                <v-icon color="success" class="mr-2" size="20">mdi-check-circle</v-icon> No credit card required
              </div>
              <div class="d-flex align-center">
                <v-icon color="success" class="mr-2" size="20">mdi-check-circle</v-icon> Free for up to 10 users
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="d-none d-md-flex justify-center position-relative perspective-container">
            <!-- Dashboard Preview -->
            <v-card width="100%" max-width="650"
              class="rounded-xl overflow-hidden glass-card elevation-24 hero-dashboard"
              image="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
              <div class="fill-height d-flex flex-column bg-surface">
                <!-- Fake Header -->
                <div class="pa-3 border-b d-flex align-center bg-surface-variant">
                  <div class="d-flex gap-2">
                    <div class="rounded-circle bg-error" style="width: 10px; height: 10px;"></div>
                    <div class="rounded-circle bg-warning" style="width: 10px; height: 10px;"></div>
                    <div class="rounded-circle bg-success" style="width: 10px; height: 10px;"></div>
                  </div>
                </div>
                <!-- Fake Body -->
                <div class="d-flex fill-height bg-background pa-4">
                  <!-- Sidebar -->
                  <div class="bg-surface-variant rounded-lg elevation-1 pa-3 mr-4" style="width: 60px;">
                    <div class="bg-primary rounded mb-4" style="height: 40px;"></div>
                    <div class="bg-grey-lighten-3 rounded mb-2" style="height: 20px;"></div>
                    <div class="bg-grey-lighten-3 rounded mb-2" style="height: 20px;"></div>
                  </div>
                  <!-- Board -->
                  <div class="flex-grow-1 d-flex gap-4 overflow-hidden">
                    <div class="bg-surface-variant rounded-lg flex-grow-1 pa-2">
                      <div class="text-caption font-weight-bold mb-2 ml-1 text-medium-emphasis">TO DO</div>
                      <div class="bg-surface rounded pa-3 mb-2 elevation-1 border-s-4 border-primary">
                        <div class="bg-surface-variant rounded mb-2" style="width: 80%; height: 10px;"></div>
                        <div class="bg-background rounded" style="width: 40%; height: 8px;"></div>
                      </div>
                      <div class="bg-surface rounded pa-3 mb-2 elevation-1">
                        <div class="bg-surface-variant rounded mb-2" style="width: 90%; height: 10px;"></div>
                        <div class="bg-background rounded" style="width: 50%; height: 8px;"></div>
                      </div>
                    </div>
                    <div class="bg-surface-variant rounded-lg flex-grow-1 pa-2">
                      <div class="text-caption font-weight-bold mb-2 ml-1 text-medium-emphasis">IN PROGRESS</div>
                      <div class="bg-surface rounded pa-3 mb-2 elevation-1 border-s-4 border-warning">
                        <div class="bg-surface-variant rounded mb-2" style="width: 70%; height: 10px;"></div>
                        <div class="d-flex justify-space-between align-center mt-2">
                          <div class="bg-background rounded" style="width: 30%; height: 8px;"></div>
                          <v-avatar size="20" color="info"></v-avatar>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>

            <!-- Floating Badge 1 -->
            <v-card class="position-absolute floating-card-1 rounded-lg pa-4 elevation-10" width="220"
              style="right: -20px; bottom: 80px;">
              <div class="d-flex align-center mb-3">
                <v-avatar color="success" size="32" class="mr-3"><v-icon size="18"
                    color="white">mdi-check</v-icon></v-avatar>
                <div>
                  <div class="text-caption font-weight-bold">Sprint Velocity</div>
                  <div class="text-caption text-success font-weight-bold">+24% Increase</div>
                </div>
              </div>
              <v-progress-linear model-value="85" color="success" height="6" rounded
                bg-color="green-lighten-4"></v-progress-linear>
            </v-card>

            <!-- Floating Badge 2 -->
            <v-card class="position-absolute floating-card-2 rounded-lg pa-3 elevation-10" width="180"
              style="left: -20px; top: 100px;">
              <div class="d-flex align-center">
                <v-avatar size="32" color="warning" class="mr-3">
                  <span class="text-white text-caption font-weight-bold">JS</span>
                </v-avatar>
                <div>
                  <div class="text-caption font-weight-bold">New Comment</div>
                  <div class="text-caption text-medium-emphasis text-truncate" style="max-width: 100px;">LGTM! Ship it
                    🚀</div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Trusted By Section -->
    <div class="bg-surface-variant py-10 border-y">
      <v-container>
        <p class="text-center text-caption font-weight-bold text-medium-emphasis text-uppercase mb-8 tracking-wide">
          Web applications</p>
        <v-row justify="center" align="center" class="opacity-60 grayscale pb-4">
          <v-col cols="6" sm="4" md="2" class="d-flex justify-center">
            <h3 class="text-h6 font-weight-black text-medium-emphasis">Aliceblue</h3>
          </v-col>
          <v-col cols="6" sm="4" md="2" class="d-flex justify-center">
            <h3 class="text-h6 font-weight-black text-medium-emphasis">Rise</h3>
          </v-col>
          <v-col cols="6" sm="4" md="2" class="d-flex justify-center">
            <h3 class="text-h6 font-weight-black text-medium-emphasis">BOT</h3>
          </v-col>
          <v-col cols="6" sm="4" md="2" class="d-flex justify-center">
            <h3 class="text-h6 font-weight-black text-medium-emphasis">EKYC</h3>
          </v-col>
          <v-col cols="6" sm="4" md="2" class="d-flex justify-center">
            <h3 class="text-h6 font-weight-black text-medium-emphasis">ANT</h3>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Features Section -->
    <v-container class="py-16">
      <div class="text-center mb-16">
        <h2 class="text-h4 font-weight-bold mb-4">Everything you need to deliver</h2>
        <p class="text-subtitle-1 text-medium-emphasis mx-auto" style="max-width: 600px;">Stop juggling multiple tools.
          Execora brings your entire product lifecycle into one unified platform.</p>
      </div>

      <v-row>
        <v-col cols="12" md="4">
          <v-card class="pa-8 h-100 rounded-xl feature-card border-thin" variant="outlined">
            <v-avatar color="primary" variant="tonal" rounded="lg" size="56" class="mb-6">
              <v-icon color="primary" size="28">mdi-kanban</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-3">Flexible Kanban Boards</h3>
            <p class="text-body-2 text-medium-emphasis leading-loose">
              Visualize work, limit work-in-progress, and maximize efficiency with our powerful, customizable boards.
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-8 h-100 rounded-xl feature-card border-thin" variant="outlined">
            <v-avatar color="purple" variant="tonal" rounded="lg" size="56" class="mb-6">
              <v-icon color="purple" size="28">mdi-run-fast</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-3">Sprint Planning</h3>
            <p class="text-body-2 text-medium-emphasis leading-loose">
              Plan upcoming sprints, prioritize your backlog, and assign tasks with ease to keep your team meaningful
              aligned.
            </p>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-8 h-100 rounded-xl feature-card border-thin" variant="outlined">
            <v-avatar color="success" variant="tonal" rounded="lg" size="56" class="mb-6">
              <v-icon color="success" size="28">mdi-chart-line</v-icon>
            </v-avatar>
            <h3 class="text-h5 font-weight-bold mb-3">Real-time Insights</h3>
            <p class="text-body-2 text-medium-emphasis leading-loose">
              Gain visibility into your team's performance with out-of-the-box reports, velocity charts, and burndown
              diagrams.
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Value Prop / Why Us Section -->
    <v-container fluid class="bg-surface-variant py-16">
      <v-container>
        <v-row align="center" class="mb-16">
          <v-col cols="12" md="6" class="pr-md-16">
            <h2 class="text-h3 text-md-h2 font-weight-black text-high-emphasis mb-4 leading-tight">
              Focus on code, <br>
              <span class="text-gradient">not chaos.</span>
            </h2>
            <p class="text-body-1 text-medium-emphasis mb-6">
              Developers love Execora because it stays out of their way. GitHub & GitLab integrations mean you can
              update
              status directly from your commit messages.
            </p>
            <div class="d-flex flex-column gap-3">
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-3">mdi-check</v-icon>
                <span class="font-weight-medium text-high-emphasis">Two-way Git synchronization</span>
              </div>
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-3">mdi-check</v-icon>
                <span class="font-weight-medium text-high-emphasis">Automated CI/CD workflows</span>
              </div>
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-3">mdi-check</v-icon>
                <span class="font-weight-medium text-high-emphasis">Smart commit linking</span>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="rounded-xl elevation-5 overflow-hidden border">
              <!-- Code block simulation -->
              <div class="bg-secondary pa-4 text-white font-mono text-caption">
                <div class="mb-2"><span class="text-pink">git</span> commit -m <span class="text-green">"feat: add login
                    page #PROJ-123"</span></div>
                <div class="mb-2 text-grey">PROJ-123 moved to In Progress</div>
                <div><span class="text-blue">➜</span> <span class="text-cyan">my-app</span> <span
                    class="text-amber">git:(main)</span> <span class="text-green">✔</span></div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- CTA Section -->
    <v-container class="py-16 text-center">
      <v-card color="primary" class="rounded-xl overflow-hidden position-relative pa-16 elevation-10" theme="dark">
        <!-- Background Decoration -->
        <div class="position-absolute top-0 right-0 opacity-20" style="transform: translate(30%, -30%)">
          <v-icon size="400" color="white">mdi-rocket-launch</v-icon>
        </div>

        <div class="position-relative z-10">
          <h2 class="text-h3 font-weight-black mb-6">Ready to transform how you work?</h2>
          <p class="text-h6 text-white mb-8 opacity-90 mx-auto" style="max-width: 600px;">
            Join thousands of high-performing teams using Execora today.
          </p>
          <v-btn size="x-large" variant="flat" color="white" class="text-primary font-weight-bold px-10 rounded-lg"
            to="/board">
            Start Your Free Trial
          </v-btn>
          <p class="text-caption mt-6 opacity-70">14-day free trial. No credit card required.</p>
        </div>
      </v-card>
    </v-container>

    <!-- Footer -->
    <v-footer class="bg-surface text-medium-emphasis py-12 border-t">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="mb-8 mb-md-0">
            <div class="d-flex align-center mb-4">
              <v-avatar color="primary" class="mr-3" size="32" rounded="lg">
                <v-icon color="white" size="18">mdi-checkbox-marked-circle-outline</v-icon>
              </v-avatar>
              <span class="text-h6 font-weight-bold text-primary">Execora</span>
            </div>
            <p class="text-body-2 mb-6" style="max-width: 300px;">
              Empowering teams to achieve greatness through better collaboration and organization.
            </p>
            <div class="d-flex gap-2">
              <v-btn icon density="comfortable" variant="tonal" class="rounded-lg"><v-icon>mdi-twitter</v-icon></v-btn>
              <v-btn icon density="comfortable" variant="tonal" class="rounded-lg"><v-icon>mdi-linkedin</v-icon></v-btn>
              <v-btn icon density="comfortable" variant="tonal" class="rounded-lg"><v-icon>mdi-github</v-icon></v-btn>
            </div>
          </v-col>

          <v-col cols="6" md="2">
            <h4 class="font-weight-bold mb-4">Product</h4>
            <div class="d-flex flex-column gap-2 text-body-2">
              <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">Features</a>
              <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">Security</a>
              <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">Enterprise</a>
            </div>
          </v-col>

          <v-col cols="6" md="2">
            <h4 class="font-weight-bold mb-4">Resources</h4>
            <div class="d-flex flex-column gap-2 text-body-2">
              <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">Documentation</a>
              <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">API</a>
              <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">Community</a>
              <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">Blog</a>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <h4 class="font-weight-bold mb-4">Stay up to date</h4>
            <v-text-field density="comfortable" bg-color="surface-variant" hide-details placeholder="Enter your email"
              variant="outlined" rounded="lg" class="mb-2">
              <template v-slot:append-inner>
                <v-btn size="small" color="primary" class="rounded-md">Subscribe</v-btn>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <v-divider class="my-8"></v-divider>

        <div class="d-flex flex-column flex-md-row justify-space-between align-center text-caption">
          <span>© 2026 MyTask Inc. All rights reserved.</span>
          <div class="d-flex gap-4 mt-4 mt-md-0">
            <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">Privacy Policy</a>
            <a href="#" class="text-decoration-none text-medium-emphasis hover-primary">Terms of Service</a>
          </div>
        </div>
      </v-container>
    </v-footer>
  </div>
</template>

<script lang="ts" setup>
// Landing page
</script>

<style scoped>
.landing-page {
  background-color: rgb(var(--v-theme-background));
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
  /* Assuming Inter is available or via vuetify config */
}

.hero-section {
  min-height: 100vh;
  padding-top: 100px;
}

/* Background Shapes */
.bg-shape-1 {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(0, 82, 204, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
  animation: pulse 10s infinite alternate;
}

.bg-shape-2 {
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(54, 179, 126, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
  border-radius: 50%;
  z-index: 0;
  animation: pulse 8s infinite alternate-reverse;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}

.text-gradient {
  background: linear-gradient(120deg, rgb(var(--v-theme-primary)), #36b37e);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.leading-tight {
  line-height: 1.15;
}

.leading-loose {
  line-height: 1.6;
}

.tracking-wide {
  letter-spacing: 0.1em;
}

.glass-card {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* 3D Transform for Hero Dashboard */
.perspective-container {
  perspective: 1000px;
}

.hero-dashboard {
  transform: rotateY(-10deg) rotateX(5deg);
  transition: transform 0.5s ease;
  box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.1);
}

.hero-dashboard:hover {
  transform: rotateY(0deg) rotateX(0deg);
}

/* Floating Animations */
.floating-card-1 {
  animation: float 6s ease-in-out infinite;
}

.floating-card-2 {
  animation: float 7s ease-in-out infinite;
  animation-delay: 1s;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }

  100% {
    transform: translateY(0px);
  }
}

/* Feature Cards */
.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.button-glow:hover {
  box-shadow: 0 0 20px rgba(0, 82, 204, 0.4);
}

.hover-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

.grayscale {
  filter: grayscale(100%);
  transition: filter 0.3s;
}

.grayscale:hover {
  filter: grayscale(0%);
  opacity: 1 !important;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}
</style>
