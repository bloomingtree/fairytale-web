import fs from 'node:fs'
import path from 'node:path'
import express from 'express'

const isProd = process.env.NODE_ENV === 'production'
const __dirname = path.dirname(new URL(import.meta.url).pathname)

async function createServer(root = process.cwd(), hmrPort) {
  const resolve = (p) => path.resolve(root, p)
  const app = express()

  let vite
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      root,
      server: { middlewareMode: true, hmr: { port: hmrPort } },
      appType: 'custom'
    })
    app.use(vite.middlewares)
  } else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    app.use(compression())
    app.use('/assets', sirv(resolve('dist/client/assets'), { immutable: true, maxAge: 31536000 }))
  }

  app.use('*', async (req, res, next) => {
    try {
      const url = req.originalUrl

      let template, render
      if (!isProd) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        render = (await import('./dist/server/entry-server.js')).render
      }

      const manifest = isProd
        ? JSON.parse(fs.readFileSync(resolve('dist/client/.vite/ssr-manifest.json'), 'utf-8'))
        : undefined

      const { appHtml, preloadLinks } = await render(url, manifest)

      const html = template
        .replace('<!--preload-links-->', preloadLinks || '')
        .replace('<!--app-html-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      !isProd && vite && vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  return { app }
}

createServer().then(({ app }) => {
  const port = process.env.PORT || 5173
  app.listen(port, () => {
    console.log(`SSR server running at http://localhost:${port}`)
  })
})

