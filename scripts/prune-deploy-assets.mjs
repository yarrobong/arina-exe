import { readdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const maxAssetBytes = 25 * 1024 * 1024

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(fullPath))
    else if (entry.isFile()) files.push(fullPath)
  }

  return files
}

// Raw staging material should never be part of the production site.
await rm(path.join(distDir, 'media', 'unused'), { recursive: true, force: true })

let removed = 0
for (const file of await walk(distDir)) {
  const info = await stat(file)
  if (info.size <= maxAssetBytes) continue

  const relative = path.relative(distDir, file)
  console.warn(`[deploy] removing oversized asset (${(info.size / 1024 / 1024).toFixed(1)} MiB): ${relative}`)
  await rm(file, { force: true })
  removed += 1
}

console.log(`[deploy] asset pruning complete; removed ${removed} oversized file(s)`)
