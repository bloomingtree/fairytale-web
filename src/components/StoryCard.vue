<template>
    <div 
      class="group rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-border relative"
      @mouseenter="showContent = true"
      @mouseleave="showContent = false"
      @click="handleStoryClick"
    >
      <!-- Book Cover Image -->
        <div class="relative aspect-[3/4] overflow-hidden">
            <img 
                :src="baseUrl + story.image_path"
                :alt="`${story.title}`"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
            />
        
            <!-- Overlay for summary on hover (desktop only) -->
            <div 
                v-if="story.description && !isMobile"
                class="absolute inset-0 bg-neutral-400/50 flex items-end p-4 transition-opacity duration-500 cursor-pointer"
                :class="{ 'opacity-0': !showContent }"
            >
                <div class="text-white flex flex-col justify-center items-center h-full">
                    <h3 class="font-bold text-base sm:text-lg text-card-foreground mb-2 line-clamp-2 text-balance leading-tight">
                    {{ story.title }}
                    </h3>
                    <p class="text-sm leading-relaxed line-clamp-4">
                    {{ story.description }}
                    </p>
                </div>
            </div>
        </div>
  
        <!-- Book Information -->
        <div class="px-3 sm:px-4 absolute bottom-0 left-0 right-0 transition-opacity duration-500 bg-gradient-to-b from-transparent to-black/80" :class="{ 'opacity-0': showContent }">
            <h3 class="font-bold text-white text-base sm:text-lg text-card-foreground mb-2 line-clamp-2 text-balance leading-tight  p-2">
                {{ story.title }}
            </h3>
            
            <!-- Improved genre tags with responsive sizing -->
            <div v-if="story.genre" class="flex flex-wrap gap-1 mb-3">
                <span 
                    v-for="genre in (Array.isArray(story.genre) ? story.genre : [story.genre])" 
                    :key="genre"
                    class="inline-block bg-accent/10 text-accent text-xs px-2 py-1 rounded-full font-medium"
                >
                    {{ genre }}
                </span>
            </div>
    
    
            <!-- Summary for mobile/always visible option -->
            <div v-if="story.description && (expanded || (isMobile && !showContent))" class="mt-3">
                <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed" :class="{ 'line-clamp-3': !expanded }">
                    {{ story.description }}
                </p>
                <button 
                    @click="toggleExpanded"
                    class="mt-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                >
                    {{ expanded ? 'Show Less' : 'Read More' }}
                </button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['story-click'])

// Props
const props = defineProps({
story: {
    type: Object,
    required: true
}
})

// Reactive state
const showContent = ref(false)
const expanded = ref(false)
const windowWidth = ref(0)
const baseUrl = 'https://r2.story.shiyin.cyou/'

// Computed properties
const isMobile = computed(() => windowWidth.value < 768)

// Methods
const toggleExpanded = () => {
    expanded.value = !expanded.value
}

const handleStoryClick = () => {
    emit('story-click', props.story.id)
}

const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
}

// Lifecycle
onMounted(() => {
    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
  