<template>
    <div 
      class="group rounded-lg h-full flex items-center justify-center relative"
    >
      <div class="max-h-full shadow-lg absolute right-0 w-1/2 aspect-[3/4]"
      :class="{'cover-container': currentPage >= 0}">
        <!-- Book Cover Image -->
        <div class="cover-spine absolute z-40 left-0 top-[-6%] h-[115%] w-[3%] bg-black/30 border-r-2 border-black/80"
          :class="'bg-[url(https://r2.story.shiyin.cyou/'+story.image_path+')] bg-cover bg-left'">
        </div>
        <!-- <img 
          :src="'https://r2.story.shiyin.cyou/' + story.image_path"
          :alt="`${story.title}`"
          class="cover-image relative w-[96%] h-full right-[-4%] object-cover z-50 border-y-4 border-r-4 border-cyan-600 rounded-r-3xl shadow-md shadow-black "
          :class="{'w-full right-0 cover-image-flipped': currentPage >= 0}"
          loading="lazy"
        /> -->
        <div class="z-10 absolute w-[95%] h-[4%] bottom-[-1.5%] left-0 border-cyan-600 bg-gradient-to-b from-[#d3dde3] via-[#f7fcfc] to-[#e2e8ed] rounded-r-3xl"></div>
        <div class="-z-10 absolute w-[98%] h-full bottom-[-3%] left-0 border-y-4 border-r-4 border-cyan-600 rounded-r-3xl"
          :class="'bg-[url(https://r2.story.shiyin.cyou/'+story.image_path+')] bg-cover bg-left'"></div>
      </div>
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
            class="w-full h-full absolute top-0 right-0 object-cover chapter-image" 
            :class="{'chapter-image-back': itemIndex === 1}"
            @click="pageClick(index, itemIndex)"/>
            <div v-else-if="item.type === 'text'" class="w-full h-full absolute top-0 right-0 bg-orange-300 rounded-r-3xl p-8  " 
            @click="pageClick(index, itemIndex)">
              <p class="indent-12 text-2xl text-left">{{ item.content }}</p>
              <AudioPlayer :src="'https://r2.story.shiyin.cyou/' + item.voice_path" @click.stop="console.log('click')" />
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
}


const nextClick = (index) => {
  if (currentPage.value <= props.story.chapters.length) {
    currentPage.value = index+1
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