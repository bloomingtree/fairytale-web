import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import StoryView from '../views/StoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainView,
      meta: {
        description: '免费音频音高分析工具，上传音频即可获取音符信息，采用Spotify Basic-Pitch技术，操作简单精准'
      }
    },
    {
      path: '/story/:id',
      name: 'story',
      component: StoryView,
    },
  ]
})

// Update meta tags on route change
router.afterEach((to) => {
  // Update page title
  const title = to.meta.title || '识音 - 免费AI扒谱神器 | 歌曲音高分析工具'
  document.title = title

  // Update meta description
  const description = to.meta.description || '免费音频音高分析工具，上传音频即可获取音符信息，采用Spotify Basic-Pitch技术'
  updateMetaTag('description', description)

  // Update Open Graph tags
  updateMetaTag('og:title', title)
  updateMetaTag('og:description', description)
  updateMetaTag('og:url', window.location.href)

  // Update Twitter Card tags
  updateMetaTag('twitter:title', title)
  updateMetaTag('twitter:description', description)

  // Update canonical URL
  updateCanonicalUrl(window.location.href)
})

// Helper function to update meta tags
function updateMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`) || 
             document.querySelector(`meta[property="${name}"]`)
  
  if (meta) {
    meta.setAttribute('content', content)
  } else {
    meta = document.createElement('meta')
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name)
    } else {
      meta.setAttribute('name', name)
    }
    meta.setAttribute('content', content)
    document.head.appendChild(meta)
  }
}

// Helper function to update canonical URL
function updateCanonicalUrl(url) {
  let canonical = document.querySelector('link[rel="canonical"]')
  if (canonical) {
    canonical.setAttribute('href', url)
  } else {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    canonical.setAttribute('href', url)
    document.head.appendChild(canonical)
  }
}

export default router
