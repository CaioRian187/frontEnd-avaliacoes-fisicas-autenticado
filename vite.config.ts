import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const criarPoliticaSeguranca = (apiUrl: string): string => {
  const connectSrc = ["'self'", apiUrl].filter(Boolean).join(' ')

  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://img.youtube.com",
    "font-src 'self' data:",
    "frame-src https://www.youtube.com https://www.youtube-nocookie.com blob:",
    `connect-src ${connectSrc}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}

const criarArquivoHeaders = (csp: string): string => `/*
  Content-Security-Policy: ${csp}; frame-ancestors 'none'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Resource-Policy: same-origin
  X-Permitted-Cross-Domain-Policies: none
  Strict-Transport-Security: max-age=31536000; includeSubDomains
`

const securityHeaders = (apiUrl: string): Plugin => {
  const csp = criarPoliticaSeguranca(apiUrl)
  let outDir = 'dist'
  let root = process.cwd()

  return {
    name: 'security-headers',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
      root = config.root
    },
    transformIndexHtml(html) {
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: csp },
          injectTo: 'head-prepend',
        },
        {
          tag: 'meta',
          attrs: { name: 'referrer', content: 'strict-origin-when-cross-origin' },
          injectTo: 'head-prepend',
        },
      ]

      return { html, tags }
    },
    closeBundle() {
      writeFileSync(resolve(root, outDir, '_headers'), criarArquivoHeaders(csp), 'utf8')
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      securityHeaders(env.VITE_URL_API ?? ''),
    ],
    build: {
      sourcemap: false,
    },
  }
})
