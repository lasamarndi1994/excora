<template>
  <v-container fluid class="pa-6 mx-auto">
    <!-- Header -->
    <div class="mb-4 d-flex align-center justify-space-between">
      <h1 class="text-h5 font-weight-bold">Inbox</h1>
      <v-btn variant="outlined" color="primary" class="text-none">Manage notifications</v-btn>
    </div>

    <!-- Tabs Section -->
    <v-tabs density="compact" color="primary" class="border-b mb-4" v-model="activeTab">
      <v-tab class="text-none font-weight-medium px-4" value="activity">Activity</v-tab>
      <v-tab class="text-none font-weight-medium px-4" value="bookmarks">Bookmarks</v-tab>
      <v-tab class="text-none font-weight-medium px-4" value="archive">Archive</v-tab>
      <v-btn icon="mdi-plus" variant="text" size="small" class="ml-2 align-self-center text-medium-emphasis"></v-btn>
    </v-tabs>

    <!-- Controls Sub-Header -->
    <div class="d-flex align-center justify-space-between border-b pb-3 mb-6">
      <div class="d-flex align-center gap-4">
        <v-btn variant="text" size="small" prepend-icon="mdi-filter-variant"
          class="text-medium-emphasis text-none font-weight-regular px-2">Filter</v-btn>
        <v-btn variant="text" size="small" prepend-icon="mdi-swap-vertical"
          class="text-medium-emphasis text-none font-weight-regular px-2">Sort: Newest</v-btn>
      </div>
      <v-btn icon="mdi-dots-horizontal" variant="text" size="small" class="text-medium-emphasis"></v-btn>
    </div>

    <!-- Inbox List Content -->
    <v-window v-model="activeTab" class="inbox-list">
      <v-window-item value="activity">

        <!-- Yesterday Section -->
        <div class="mb-6 group-section">
          <div class="text-subtitle-2 text-medium-emphasis font-weight-medium px-4 mb-3">Yesterday</div>
          <v-divider class="mb-0"></v-divider>

          <!-- Item 1 -->
          <div class="inbox-item pa-4 border-b">
            <div class="d-flex align-start">
              <v-icon size="20" class="mr-4 text-medium-emphasis mt-1">mdi-check-circle-outline</v-icon>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <h3 class="text-subtitle-1 font-weight-bold line-height-1">Quarterly contest Engagment real time
                    dashboard in partnerd dashboard <v-icon size="16"
                      class="ml-1 text-medium-emphasis">mdi-paperclip</v-icon></h3>
                  <span class="text-caption text-medium-emphasis whitespace-nowrap ml-4">Due soon</span>
                </div>

                <div class="d-flex align-center text-body-2 mb-2">
                  <v-avatar size="24" class="mr-2 border-avatar">
                    <v-img src="https://i.pravatar.cc/150?img=47" cover></v-img>
                  </v-avatar>
                  <span class="font-weight-medium mr-1">Satya Bal</span>
                  <span class="text-medium-emphasis text-caption">· Yesterday at 8:13pm</span>
                </div>

                <div class="d-flex align-center text-body-2 pl-8">
                  <v-chip size="x-small" color="pink-lighten-4" text-color="pink-darken-4"
                    class="mr-2 font-weight-bold px-2 sa-badge" rounded="sm">sa</v-chip>
                  <span
                    class="text-primary text-decoration-underline mr-1">saravananloganathan@aliceblueindia.com</span>
                  <span class="text-medium-emphasis">Please find the details and share the TAT asap.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Past 7 Days Section -->
        <div class="mb-6 group-section">
          <div class="text-subtitle-2 text-medium-emphasis font-weight-medium px-4 mb-3">Past 7 Days</div>
          <v-divider class="mb-0"></v-divider>

          <!-- Item 2 -->
          <div class="inbox-item pa-4 border-b">
            <div class="d-flex align-start">
              <v-icon size="20" class="mr-4 text-medium-emphasis mt-1">mdi-check-circle-outline</v-icon>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <h3 class="text-subtitle-1 font-weight-bold line-height-1">Quarterly Engagement contest for all
                    partners</h3>
                </div>

                <div class="d-flex align-center text-body-2 mb-1">
                  <v-avatar size="24" class="mr-2 border-avatar">
                    <v-img src="https://i.pravatar.cc/150?img=11" cover></v-img>
                  </v-avatar>
                  <span class="font-weight-medium mr-1">Lasa Marndi</span>
                  <span class="text-medium-emphasis text-caption">· 2 days ago</span>
                </div>

                <div class="text-body-2 text-medium-emphasis pl-8">
                  Get me creatives for this banners
                </div>
              </div>
            </div>
          </div>

          <!-- Item 3 -->
          <div class="inbox-item pa-4 border-b">
            <div class="d-flex align-start">
              <v-icon size="20" class="mr-4 text-medium-emphasis mt-1">mdi-check-circle-outline</v-icon>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <h3 class="text-subtitle-1 font-weight-bold line-height-1">Partner lead automation in crm</h3>
                  <span class="text-caption text-red whitespace-nowrap ml-4">Overdue</span>
                </div>

                <div class="d-flex align-center text-body-2 mb-1">
                  <v-avatar size="24" class="mr-2 border-avatar">
                    <v-img src="https://i.pravatar.cc/150?img=11" cover></v-img>
                  </v-avatar>
                  <span class="font-weight-medium mr-1">Lasa Marndi</span>
                  <span class="text-medium-emphasis text-caption">· 5 days ago</span>
                </div>

                <div class="text-body-2 text-medium-emphasis pl-8">
                  Update the status
                </div>
              </div>
            </div>
          </div>

        </div>

      </v-window-item>

      <v-window-item value="bookmarks">
        <div class="mb-6 group-section">
          <div class="text-subtitle-2 text-medium-emphasis font-weight-medium px-4 mb-3 mt-4">Saved for later</div>
          <v-divider class="mb-0"></v-divider>

          <!-- Bookmark Item 1 -->
          <div class="inbox-item pa-4 border-b">
            <div class="d-flex align-start">
              <v-icon size="20" color="warning" class="mr-4 mt-1">mdi-bookmark</v-icon>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <h3 class="text-subtitle-1 font-weight-bold line-height-1">Weekly sync notes and action items</h3>
                </div>

                <div class="d-flex align-center text-body-2 mb-1">
                  <v-avatar size="24" class="mr-2 border-avatar">
                    <v-img src="https://i.pravatar.cc/150?img=33" cover></v-img>
                  </v-avatar>
                  <span class="font-weight-medium mr-1">John Doe</span>
                  <span class="text-medium-emphasis text-caption">· 3 days ago</span>
                </div>

                <div class="text-body-2 text-medium-emphasis pl-8">
                  Review the attached document before the next sprint planning.
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-window-item>

      <v-window-item value="archive">
        <div class="mb-6 group-section">
          <div class="text-subtitle-2 text-medium-emphasis font-weight-medium px-4 mb-3 mt-4">Older than 30 days</div>
          <v-divider class="mb-0"></v-divider>

          <!-- Archive Item 1 -->
          <div class="inbox-item pa-4 border-b">
            <div class="d-flex align-start">
              <v-icon size="20" class="mr-4 text-medium-emphasis mt-1">mdi-package-down</v-icon>
              <div class="flex-grow-1">
                <div class="d-flex justify-space-between align-start mb-2">
                  <h3 class="text-subtitle-1 font-weight-bold line-height-1 text-medium-emphasis">Design system audit
                    and cleanup</h3>
                  <span class="text-caption text-medium-emphasis whitespace-nowrap ml-4">Completed</span>
                </div>

                <div class="d-flex align-center text-body-2 mb-1">
                  <v-avatar size="24" class="mr-2 border-avatar opacity-80">
                    <v-img src="https://i.pravatar.cc/150?img=47" cover></v-img>
                  </v-avatar>
                  <span class="font-weight-medium mr-1 text-medium-emphasis">Satya Bal</span>
                  <span class="text-disabled text-caption">· 1 month ago</span>
                </div>

                <div class="text-body-2 text-disabled pl-8">
                  All old components have been successfully deprecated and archived from the main branch.
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-window-item>
    </v-window>

  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('activity')
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

.line-height-1 {
  line-height: 1.3;
}

.whitespace-nowrap {
  white-space: nowrap;
}

/* Custom Tab styling overrides to match image */
:deep(.v-btn--active) {
  color: var(--v-theme-primary);
}

.group-section .v-divider {
  border-color: #e0e0e0;
}

/* List Item styling */
.inbox-item {
  transition: background-color 0.2s ease;
  background-color: transparent;
}

.inbox-item:hover {
  background-color: #f4f5f7;
  cursor: pointer;
}

.border-avatar {
  border: 1px solid #e0e0e0;
}

/* Custom SA badge to mimic Jira's pink tag */
.sa-badge {
  background-color: #ffe8f0 !important;
  color: #bf2600 !important;
  border-radius: 3px !important;
  height: 18px !important;
  font-size: 0.65rem !important;
}
</style>
