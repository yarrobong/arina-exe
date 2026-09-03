import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const input = path.resolve('media-originals')
const output = path.resolve('public/media')

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return (await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return [full]
  }))).flat()
}

try {
  const files = (await walk(input)).filter((file) => /\.(jpe?g|png|heic|heif)$/i.test(file))
  for (const file of files) {
    const rel = path.relative(input, file).replace(/\.[^.]+$/, '.webp')
    const dest = path.join(output, rel)
    await fs.mkdir(path.dirname(dest), { recursive: true })
    await sharp(file)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(dest)
    console.log('✓', rel)
  }
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.log('Создай папку media-originals/ и положи туда исходные фотографии по тем же категориям.')
    process.exit(0)
  }
  throw error
}
