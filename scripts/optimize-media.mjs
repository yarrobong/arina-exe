import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const originalsDir = path.resolve('media-originals')
const publicMediaDir = path.resolve('public/media')
const optimizeExisting = process.argv.includes('--existing')
const maxWidth = 1080
const quality = 80
const recompressThreshold = 750 * 1024

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return (await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return [full]
  }))).flat()
}

async function encode(input, output, format) {
  const pipeline = sharp(input)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })

  if (format === 'webp') return pipeline.webp({ quality, effort: 5, smartSubsample: true }).toFile(output)
  return pipeline.jpeg({ quality, mozjpeg: true }).toFile(output)
}

async function importOriginals() {
  const files = (await walk(originalsDir)).filter((file) => /\.(jpe?g|png|heic|heif)$/i.test(file))
  for (const file of files) {
    const relative = path.relative(originalsDir, file).replace(/\.[^.]+$/, '.webp')
    const destination = path.join(publicMediaDir, relative)
    await fs.mkdir(path.dirname(destination), { recursive: true })
    await encode(file, destination, 'webp')
    console.log('✓', relative)
  }
}

async function optimizePublishedImages() {
  const files = (await walk(publicMediaDir)).filter((file) => {
    const relative = path.relative(publicMediaDir, file)
    return !relative.startsWith(`unused${path.sep}`) && /\.(webp|jpe?g)$/i.test(file)
  })

  let savedBytes = 0
  let optimized = 0

  for (const file of files) {
    const before = await fs.stat(file)
    const metadata = await sharp(file).metadata()
    if ((metadata.width ?? 0) <= maxWidth && before.size < recompressThreshold) continue

    const format = /\.webp$/i.test(file) ? 'webp' : 'jpeg'
    const temporary = `${file}.optimize-${process.pid}`
    await encode(file, temporary, format)
    const after = await fs.stat(temporary)

    if (after.size >= before.size * 0.95) {
      await fs.rm(temporary, { force: true })
      continue
    }

    await fs.rename(temporary, file)
    savedBytes += before.size - after.size
    optimized += 1
    console.log('✓', path.relative(publicMediaDir, file), `${Math.round(before.size / 1024)} → ${Math.round(after.size / 1024)} KB`)
  }

  console.log(`Оптимизировано: ${optimized}; сэкономлено: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`)
}

try {
  if (optimizeExisting) await optimizePublishedImages()
  else await importOriginals()
} catch (error) {
  if (error?.code === 'ENOENT' && !optimizeExisting) {
    console.log('Создай папку media-originals/ и положи туда исходные фотографии по тем же категориям.')
    process.exit(0)
  }
  throw error
}
