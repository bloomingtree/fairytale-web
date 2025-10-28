import { createSSRApp, createApp as _createApp } from 'vue'
import App from './App.vue'
import createRouter from './router'

export function createVueApp() {
  const app = import.meta.env.SSR ? createSSRApp(App) : _createApp(App)
  const router = createRouter()
  app.use(router)
  return { app, router }
}

