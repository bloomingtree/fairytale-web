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
        description: '精选童话故事网站，收录经典童话、寓言故事，为孩子们提供优质的阅读体验，培养想象力和阅读兴趣'
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
  const title = to.meta.title || '童话世界 - 精选童话故事网站 | 经典童话在线阅读'
  document.title = title

  // Update meta description
  const description = to.meta.description || '精选童话故事网站，收录经典童话、寓言故事，为孩子们提供优质的阅读体验，培养想象力和阅读兴趣'
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
