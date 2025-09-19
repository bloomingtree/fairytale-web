<template>
  <div class="flex flex-col items-center justify-center h-screen relative">
    <div v-if="story" class="w-3/4 h-5/6">
      <StoryBook :story="story" />
    </div>
    <div v-else class="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-16">
      <h1>故事加载中...</h1>
    </div>
    <div class="absolute left-0 top-0 w-24 h-full z-10 flex justify-center items-center">
      <SideMenu />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import {getStoryDetail} from '../api/fairytale'
import StoryBook from '../components/StoryBook.vue'
import SideMenu from '../components/SideMenu.vue'
const route = useRoute()
const id = route.params.id

const story = ref(null)

onMounted(() => {
    getStoryDetail(id).then(res => {
        story.value = res.result
    })
})
</script>