<template>
    <div class="flex flex-col items-center space-y-4">
      <!-- Page Info -->
      <div class="text-sm text-muted-foreground">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
  
      <!-- Desktop Pagination Controls -->
      <div class="hidden sm:flex items-center space-x-2">
        <!-- Previous Button -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-muted-foreground transition-colors"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
  
        <!-- Page Numbers -->
        <div class="flex items-center space-x-1">
          <!-- First page -->
          <button
            v-if="showFirstPage"
            @click="goToPage(currentPage - 1)"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="currentPage === 1 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground bg-card border border-border hover:bg-accent hover:text-accent-foreground'"
          >
            1
          </button>
  
          <!-- First ellipsis -->
          <span v-if="showFirstEllipsis" class="px-2 py-2 text-muted-foreground">
            ...
          </span>
  
          <!-- Visible page numbers -->
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="currentPage === page 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground bg-card border border-border hover:bg-accent hover:text-accent-foreground'"
          >
            {{ page }}
          </button>
  
          <!-- Last ellipsis -->
          <span v-if="showLastEllipsis" class="px-2 py-2 text-muted-foreground">
            ...
          </span>
  
          <!-- Last page -->
          <button
            v-if="showLastPage"
            @click="goToPage(currentPage)"
            class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
            :class="currentPage === totalPages 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground bg-card border border-border hover:bg-accent hover:text-accent-foreground'"
          >
            {{ totalPages }}
          </button>
        </div>
  
        <!-- Next Button -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-card disabled:hover:text-muted-foreground transition-colors"
        >
          Next
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
  
      <!-- Enhanced mobile pagination with better UX -->
      <div class="sm:hidden flex items-center space-x-3">
        <!-- Mobile Previous Button -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
  
        <!-- Mobile page selector -->
        <select
          :value="currentPage"
          @change="goToPage(parseInt($event.target.value))"
          class="px-3 py-2 text-sm bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option v-for="page in totalPages" :key="page" :value="page">
            Page {{ page }}
          </option>
        </select>
  
        <!-- Mobile Next Button -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  // Props
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  })
  
  // Emits
  const emit = defineEmits(['page-change'])
  
  // Constants
  const VISIBLE_PAGES = 5 // Number of page buttons to show
  
  // Computed properties for pagination logic
  const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(2, props.currentPage - Math.floor(VISIBLE_PAGES / 2))
    const end = Math.min(props.totalPages - 1, start + VISIBLE_PAGES - 1)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== props.totalPages) {
        pages.push(i)
      }
    }
    
    return pages
  })
  
  const showFirstPage = computed(() => {
    return props.totalPages > 1
  })
  
  const showLastPage = computed(() => {
    return props.totalPages > 1 && props.totalPages !== 1
  })
  
  const showFirstEllipsis = computed(() => {
    return visiblePages.value.length > 0 && visiblePages.value[0] > 2
  })
  
  const showLastEllipsis = computed(() => {
    return visiblePages.value.length > 0 && 
           visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
  })
  
  // Methods
  const goToPage = (page) => {
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
      emit('page-change', page)
    }
  }
  </script>
  