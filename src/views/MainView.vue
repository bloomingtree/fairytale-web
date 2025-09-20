<template>
  <div class="min-h-screen bg-background">
    <!-- Header Section -->
    <header class="bg-card shadow-sm border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-center text-balance">
          📚 童话故事集
        </h1>
        <p class="text-muted-foreground text-center mt-2 text-base sm:text-lg max-w-2xl mx-auto">
          从我们的精选收藏中，发现神奇的故事和冒险，培养想象力和阅读兴趣
        </p>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12 sm:py-16">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p class="text-muted-foreground text-sm">故事正在上新...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12 sm:py-16">
        <div class="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <div class="text-destructive text-4xl mb-4">📚</div>
          <h3 class="text-lg font-semibold text-destructive mb-2">Oops! Something went wrong</h3>
          <p class="text-destructive/80 text-sm mb-4">{{ error }}</p>
          <button 
            @click="fetchBooks(0)" 
            class="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Book Gallery Grid -->
      <div v-else>
        <!-- Enhanced responsive grid with better breakpoints -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <StoryCard 
            v-for="story in storyList" 
            :key="story.id" 
            :story="story"
            @story-click="handleStoryClick"
          />
        </div>

        <!-- Empty State -->
        <div v-if="storyList.length === 0 && !loading" class="text-center py-12 sm:py-16">
          <div class="text-6xl mb-4">📖</div>
          <h3 class="text-xl font-semibold text-foreground mb-2">No books found</h3>
          <p class="text-muted-foreground">Check back later for new stories!</p>
        </div>

        <!-- Pagination Controls -->
        <PaginationControls 
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
          class="mt-8 sm:mt-12"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-card border-t border-border mt-12 sm:mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="text-center text-muted-foreground text-sm">
          <p>&copy; 2025 童话故事集</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StoryCard from '../components/StoryCard.vue'
import PaginationControls from '../components/PaginationControl.vue'
import { getStoryList } from '../api/fairytale'

// Reactive state
const storyList = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(0)
const totalPages = ref(1)
const pageSize = 10

const router = useRouter()

// Fetch books function
const fetchBooks = async (pageNum = 0) => {
  loading.value = true
  error.value = null
  
  try {
    console.log('fetchBooks', pageNum, pageSize)
    const response = await getStoryList(pageNum, pageSize)
    storyList.value = response.result.story
    totalPages.value = Math.ceil(response.result.total/pageSize)
    currentPage.value = pageNum
  } catch (err) {
    error.value = 'Failed to load storybooks. Please try again.'
    console.error('Error fetching books:', err)
  } finally {
    loading.value = false
  }
}

const handleStoryClick = (id) => {  
  router.push(`/story/${id}`)
}

// Handle page change
const handlePageChange = (page) => {
  fetchBooks(page)
  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Load initial data
onMounted(() => {
  fetchBooks()
})
</script>

