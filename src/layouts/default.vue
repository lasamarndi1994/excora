<template>
  <v-app>
    <NavigationSidebar />
    <AppTopBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// eslint-disable-next-line vue/script-indent
import AppTopBar from '@/components/AppTopBar.vue'
import NavigationSidebar from '@/components/NavigationSidebar.vue'
</script>
