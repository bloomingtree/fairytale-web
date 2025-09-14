<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import NavigationBar from './components/NavigationBar.vue'
const route = useRoute()

// 计算是否显示导航栏
const showNavigationBar = computed(() => {
  return route.name !== 'main'
})
</script>

<template>
  <div class="h-screen w-full flex flex-col">
    <NavigationBar v-if="showNavigationBar" class="sticky top-0 z-10"/>
    <div class="flex-1 overflow-auto">
      <RouterView/>
    </div>
  </div>
</template>
