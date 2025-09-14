<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="w-full h-full flex flex-col items-center justify-center">
        <div v-for="story in storyList" :key="story.id">
          <h2>{{ story.author }}</h2>
        </div>
    </div>
  </div>
</template>

<script setup>
import { getStoryList } from '../api/fairytale'
import { ref, onMounted } from 'vue'
const storyList = ref([])

onMounted(async () => {
  const res = await getStoryList(0, 10)
  console.log(res)
  storyList.value = res.story
})
</script>