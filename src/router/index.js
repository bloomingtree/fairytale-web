import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import StoryView from '../views/StoryView.vue'

function createRouterInstance() {
  const history = import.meta.env.SSR
    ? createMemoryHistory()
    : createWebHistory(import.meta.env.BASE_URL)

  const router = _createRouter({
    history,
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

  if (!import.meta.env.SSR) {
    router.afterEach((to) => {
      const title = to.meta.title || '童话世界 - 精选童话故事网站 | 经典童话在线阅读'
      document.title = title

      const description = to.meta.description || '精选童话故事网站，收录经典童话、寓言故事，为孩子们提供优质的阅读体验，培养想象力和阅读兴趣'
      updateMetaTag('description', description)

      updateMetaTag('og:title', title)
      updateMetaTag('og:description', description)
      updateMetaTag('og:url', window.location.href)

      updateMetaTag('twitter:title', title)
      updateMetaTag('twitter:description', description)

      updateCanonicalUrl(window.location.href)
    })

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
  }

  return router
}

export default createRouterInstance
