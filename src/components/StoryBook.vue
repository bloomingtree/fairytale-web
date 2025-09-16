<template>
    <div 
      class="group rounded-lg h-full flex items-center justify-center relative"
    >
      <div class="max-h-full shadow-lg absolute right-0 w-1/2 aspect-[3/4]"
      :class="{'cover-container': currentPage >= 0}"
      @click="nextClick(0)">
        <!-- Book Cover Image -->
        <div class="cover-spine absolute z-20 left-0 top-[-6%] h-[115%] w-[3%] bg-black/30 border-r-2 border-slate-300/50"
          :class="'bg-[url(https://r2.story.shiyin.cyou/'+story.image_path+')] bg-cover bg-left'"></div>
        <img 
          :src="'https://r2.story.shiyin.cyou/' + story.image_path"
          :alt="`${story.title}`"
          class="cover-image relative w-[96%] h-full right-[-4%] object-cover z-50 border-y-4 border-r-4 border-cyan-600 rounded-r-3xl shadow-md shadow-black "
          :class="{'w-full right-0 cover-image-flipped': currentPage >= 0}"
          loading="lazy"
        />
        <div class="z-10 absolute w-[95%] h-[4%] bottom-[-1.5%] left-0 border-cyan-600 bg-gradient-to-b from-[#d3dde3] via-[#f7fcfc] to-[#e2e8ed] rounded-r-3xl"></div>
        <div class="-z-10 absolute w-[98%] h-full bottom-[-3%] left-0 border-y-4 border-r-4 border-cyan-600 rounded-r-3xl"
          :class="'bg-[url(https://r2.story.shiyin.cyou/'+story.image_path+')] bg-cover bg-left'"></div>
      </div>
      <div class="z-20 story-pages absolute w-full h-full top-0 right-0 overflow-hidden">
        <div  v-for="(chapter, index) in story.chapters" :key="chapter.id"
        :style="{'z-index': 50 - Math.abs(currentPage - index)}"
        class="w-full h-full absolute top-0 right-0 flex">
          <img :src="'https://r2.story.shiyin.cyou/' + chapter.image_path" :alt="chapter.title" 
          class="w-1/2 h-full object-cover chapter-image" 
          :class="{'w-full right-0 chapter-image-flipped': currentPage >= index}"
          
          @click="prevClick(index)"/>
          <div class="w-1/2 h-full bg-red-500" @click="nextClick(index)">
            <p>{{ chapter.content }}</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const props = defineProps({
  story: {
    type: Object,
    required: true,
  },
})
const isFlipped = ref(false)
const currentPage = ref(0)

onMounted(() => {
  console.log(props.story)
    isFlipped.value = true
})

const prevClick = (index) => {
  if (currentPage.value >= 0) {
    currentPage.value = index-1
  }
  console.log(currentPage.value)
}


const nextClick = (index) => {
  if (currentPage.value < props.story.chapters.length) {
    currentPage.value = index+1
  }
  console.log(currentPage.value)
}


</script>

<style scoped>
@keyframes flip-to-left {
    from {
        transform: rotateY(0);
    }
    to {
        transform: rotateY(-180deg);
    }
}
.cover-container {
  rotate: x 4deg;
  rotate: y 4deg;
  rotate: z -1deg;
}
.cover-spine {
  transform-origin: left center;
  transform: skew(-30deg) rotateZ(-30deg);
}
.cover-image {
  transform-origin: left center;
  transform: rotateY(0deg);
}
.cover-image-flipped {
  transform-origin: left center;
  transform: rotateY(180deg);
}
.chapter-image {
  transform-origin: right center;
  transform: rotateY(-180deg);
}
.chapter-image-flipped {
  transform-origin: left center;
  transform: rotateY(0deg);
}
</style>