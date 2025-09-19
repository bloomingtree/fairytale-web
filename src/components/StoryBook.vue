<template>
    <div 
      class="group rounded-lg h-full flex items-center justify-center relative"
    >
      <div class="z-20 story-pages absolute w-full h-full top-0 right-0">
        <!-- 包含前后页 -->
        <div  v-for="(page, index) in pages" :key="index"
        :style="{'z-index': 39 - Math.abs(lastPage - index)}"
        class="w-1/2 h-full absolute top-0 right-0 transition-transform"
        :class="{'whole-page-flipped': page.status === 'to-left', 'whole-page': page.status === 'to-right'}"
        style="transform-style: preserve-3d;"
        >
        <!-- 单个页面 -->
          <div v-for="(item, itemIndex) in page" :key="itemIndex" class="w-full h-full absolute top-0 right-0 z-10"
          :class="{'z-20': itemIndex === 0, 'page-back': itemIndex === 1}"
          >
            <img v-if="item.type === 'image'" :src="'https://r2.story.shiyin.cyou/' + item.path" alt="无法加载" 
            class="w-full h-full absolute top-0 right-0 object-cover bg-orange-300 chapter-image" 
            :class="{'chapter-image-back': itemIndex === 1}"
            @click="pageClick(index, itemIndex)"/>
            <div v-else-if="item.type === 'text'" class="w-full h-full absolute top-0 right-0 bg-orange-300 rounded-r-3xl p-8  " 
            @click="pageClick(index, itemIndex)">
              <h2 class="text-2xl font-bold mb-4">{{ item.title }}</h2>
              <p class="indent-12 text-2xl text-left">{{ item.content }}</p>
              <AudioPlayer 
              :src="'https://r2.story.shiyin.cyou/' + item.voice_path" 
              :index="index"
              :ref="(el)=>setPlayerRef(index, el)"
              @click.stop=""
              class="mt-4"
              @play-ended="pageVoiceEnded(index)"/>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AudioPlayer from './AudioPlayer.vue'
const props = defineProps({
  story: {
    type: Object,
    required: true,
  },
})
const pages = ref([])
const currentPage = ref(-1)
const lastPage = ref(0)
// 记录目前哪一页z-index最大
const topPage = ref(0)
const playerRefs = ref([]);
const isAutoPlay = ref(false)

const setPlayerRef = (index, el) => {
  if (el) {
    playerRefs.value[index] = el
  }
}

onMounted(() => {
  console.log(props.story)
  loadPages()
  console.log(currentPage.value)
  
})

const loadPages = () => {
  let page = [
    {
      type: 'image',
      path: props.story.image_path,
    },
  ]
  for(const chapter of props.story.chapters) {
    page.push({
      type: 'image',
      path: chapter.image_path,
    })
    pages.value.push(page)
    page = []
    page.push({
      type: 'text',
      content: chapter.content,
      title: chapter.title,
      voice_path: chapter.voice_path,
    })
  }
  page.push({
    type: 'image',
    path: props.story.image_path,
  })
  page.status = 'unread'
  pages.value.push(page)
}

const pageClick = (index, itemIndex) => {
  getLastPlayStatus(currentPage.value)
  lastPage.value = index
  if (itemIndex === 0) {
    pages.value[index].status = 'to-left'
    nextClick(index)
  } else {
    pages.value[index].status = 'to-right'
    prevClick(index+1)
  }
  topPage.value = currentPage.value-1
  console.log(lastPage.value, currentPage.value)
}

const prevClick = (index) => {
  if (currentPage.value >= 0) {
    currentPage.value = index-1
  }
  stopAllPlayers()
  if(isAutoPlay.value) {
    playOnePlayer(currentPage.value)
  }
}


const nextClick = (index) => {
  if (currentPage.value <= props.story.chapters.length) {
    currentPage.value = index+1
  }
  stopAllPlayers()
  if(isAutoPlay.value) {
    playOnePlayer(currentPage.value)
  }
}

const stopAllPlayers = () => {
  playerRefs.value.forEach(player => {
    player.pause()
  })
}

const getLastPlayStatus = (index) => {
  if(playerRefs.value[index]) {
    isAutoPlay.value = playerRefs.value[index].getIsPlaying()
  } else {
    isAutoPlay.value = false
  }
}

const playOnePlayer = (index) => {
  console.log(playerRefs.value[index], index)
  if(playerRefs.value[index]) {
    playerRefs.value[index].start()
  }
}

const pageVoiceEnded = (index) => {
  if(index === currentPage.value) {
    pageClick(index, 0)
  }
}

</script>

<style scoped>
@keyframes flip-to-left {
    0% {
        transform: perspective(300rem) rotateY(0);
    }
    100% {
        transform: perspective(300rem) rotateY(-180deg);
    }
}

@keyframes flip-to-right {
  
    0% {
        transform: perspective(300rem) rotateY(-180deg);
    }
    100% {
        transform: perspective(300rem) rotateY(0deg);
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
  transition: transform 0.3s ease-in-out;
}
.cover-image:hover {
  transform: rotateY(5deg) skew(-3deg) rotateZ(-3deg);
}
.cover-image-flipped {
  transform-origin: left center;
  transform: rotateY(180deg);
}
.chapter-image {
  transition: transform 0.3s ease-in-out;
  border-radius: 0 1.5rem 1.5rem 0;
}
.chapter-image-back {
  transform: scale3d(-1, 1, 1) translateZ(-1px);
  transition: transform 0.3s ease-in-out;
  border-radius: 1.5rem 0 0 1.5rem;
}
.page-back {
  transform: translateZ(-1px);
}

.whole-page {
  animation: flip-to-right 0.8s ease-in-out forwards;
  transform-origin: left center;
}
.whole-page-flipped {
  transform-origin: left center;
  animation: flip-to-left 0.8s ease-in-out forwards;
}
</style>