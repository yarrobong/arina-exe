import fs from 'node:fs/promises'
import path from 'node:path'

const srcDir = path.resolve('src')
const publicDir = path.resolve('public')
const sourceExtensions = new Set(['.ts', '.tsx', '.css'])

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(fullPath))
    else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name))) files.push(fullPath)
  }
  return files
}

const references = new Map()
for (const file of await walk(srcDir)) {
  const content = await fs.readFile(file, 'utf8')
  const pattern = /(['"`])(\/media\/.*?)\1/g
  for (const match of content.matchAll(pattern)) {
    const reference = match[2].split(/[?#]/, 1)[0]
    if (reference.includes('${')) continue
    if (!references.has(reference)) references.set(reference, [])
    references.get(reference).push(path.relative(process.cwd(), file))
  }
}

const missing = []
for (const [reference, files] of references) {
  const publicPath = path.join(publicDir, reference.slice(1))
  try {
    const info = await fs.stat(publicPath)
    if (!info.isFile()) missing.push({ reference, files })
  } catch {
    missing.push({ reference, files })
  }
}

if (missing.length > 0) {
  console.error('[verify-media] missing public media references:')
  for (const item of missing) console.error(`  ${item.reference} ← ${item.files.join(', ')}`)
  process.exit(1)
}

console.log(`[verify-media] OK: ${references.size} static media reference(s) exist`)
