import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const outputDir = process.env.STATIC_PROFILE_DIR || join(rootDir, 'dist', 'static-profiles')
const port = Number(process.env.PORT || 4173)
const basePath = normalizeBasePath(process.env.STATIC_PROFILE_BASE_PATH || '/')

function normalizeBasePath(value) {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`

  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8'
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8'
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8'
  if (filePath.endsWith('.vcf')) return 'text/vcard; charset=utf-8'
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8'
  return 'application/octet-stream'
}

function resolveRequestPath(urlPath) {
  const requestPath = decodeURIComponent(urlPath.split('?')[0])
  if (basePath !== '/' && !requestPath.startsWith(basePath)) return null

  const pathWithinBase = basePath === '/' ? requestPath : requestPath.slice(basePath.length - 1)

  if (!pathWithinBase.startsWith('/')) return null

  const relativePath = pathWithinBase.endsWith('/') ? `${pathWithinBase}index.html` : pathWithinBase
  const resolvedPath = normalize(join(outputDir, relativePath))

  return resolvedPath.startsWith(outputDir) ? resolvedPath : null
}

const server = createServer(async (request, response) => {
  const filePath = resolveRequestPath(request.url || '/')

  if (!filePath || !existsSync(filePath) || !(await stat(filePath)).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('Not found')
    return
  }

  response.writeHead(200, { 'content-type': contentType(filePath) })
  createReadStream(filePath).pipe(response)
})

server.listen(port, () => {
  console.log(`Static profile proof server listening on http://127.0.0.1:${port}${basePath}`)
})
