import { readdir, rm, stat, writeFile } from 'node:fs/promises'
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

// Raw/editable material should never be part of the production site.
await rm(path.join(distDir, 'media', 'unused'), { recursive: true, force: true })
await rm(path.join(distDir, 'media', 'разбери и не удаляй'), { recursive: true, force: true })
await rm(path.join(distDir, 'media', 'разбери и не удаляй'), { recursive: true, force: true })
// The theater scene now uses a lightweight CSS/SVG seat diagram.
await rm(path.join(distDir, 'media', 'opera-ballet-map.svg'), { force: true })
await rm(path.join(distDir, 'media', 'opera-ballet-map.webp'), { force: true })

let removed = 0
for (const file of await walk(distDir)) {
  const info = await stat(file)
  if (info.size <= maxAssetBytes) continue

  const relative = path.relative(distDir, file)
  console.warn(`[deploy] removing oversized asset (${(info.size / 1024 / 1024).toFixed(1)} MiB): ${relative}`)
  await rm(file, { force: true })
  removed += 1
}

const priority = (relative) => {
  if (relative.includes('media/evolution/arina-18.')) return 0
  if (relative.includes('media/childhood/')) return 1
  if (relative.includes('media/school/1-4/')) return 2
  if (relative.includes('media/school/5-9/')) return 3
  if (relative.includes('media/school/10-11/')) return 4
  if (relative.includes('media/urfu/')) return 5
  if (relative.includes('media/friends/')) return 6
  if (relative.includes('media/relationship/')) return 7
  if (relative.includes('media/inventory/')) return 8
  if (relative.includes('media/compromat/')) return 9
  return 10
}

const imageManifest = (await walk(path.join(distDir, 'media')))
  .filter((file) => /\.(?:avif|webp|png|jpe?g)$/i.test(file))
  .map((file) => path.relative(distDir, file).split(path.sep).join('/'))
  .sort((a, b) => priority(a) - priority(b) || a.localeCompare(b, 'ru'))

await writeFile(
  path.join(distDir, 'media-image-manifest.json'),
  JSON.stringify(imageManifest),
  'utf8',
)

console.log(`[deploy] asset pruning complete; removed ${removed} oversized file(s); warmup manifest contains ${imageManifest.length} image(s)`)
