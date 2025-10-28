import { renderToString } from 'vue/server-renderer'
import { createVueApp } from './app'

export async function render(url, manifest) {
  const { app, router } = createVueApp()
  await router.push(url)
  await router.isReady()

  const ctx = {}
  const appHtml = await renderToString(app, ctx)

  const preloadLinks = renderPreloadLinks(ctx.modules || new Set(), manifest)
  return { appHtml, preloadLinks, head: { title: undefined, meta: [] } }
}

function renderPreloadLinks(modules, manifest) {
  if (!manifest) return ''
  const seen = new Set()
  let links = ''
  for (const id of modules) {
    const files = manifest[id]
    if (!files) continue
    for (const file of files) {
      if (seen.has(file)) continue
      seen.add(file)
      if (file.endsWith('.js')) {
        links += `<link rel="modulepreload" crossorigin href="/${file}">`
      } else if (file.endsWith('.css')) {
        links += `<link rel="stylesheet" href="/${file}">`
      } else if (file.endsWith('.woff2')) {
        links += `<link rel="preload" href="/${file}" as="font" type="font/woff2" crossorigin>`
      } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.gif') || file.endsWith('.webp')) {
        links += `<link rel="preload" href="/${file}" as="image">`
      }
    }
  }
  return links
}

