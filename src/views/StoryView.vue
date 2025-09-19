<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div v-if="story" class="w-3/4 h-5/6">
      <StoryBook :story="story" />
    </div>
    <div v-else class="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-16">
      <h1>Loading...</h1>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import {getStoryDetail} from '../api/fairytale'
import StoryBook from '../components/StoryBook.vue'
const route = useRoute()
const id = route.params.id

const story = ref(null)

onMounted(() => {
    getStoryDetail(id).then(res => {
        story.value = res.result
    })
})
</script>