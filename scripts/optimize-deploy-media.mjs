import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const distDir = path.resolve('dist')
const mediaDir = path.join(distDir, 'media')
const minAudioBytes = 1500 * 1024
const minImageBytes = 110 * 1024
const maxImageWidth = 1080
let savedBytes = 0
let optimizedAudio = 0
let optimizedImages = 0
let convertedVideos = 0

function ffmpegAvailable() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return (await Promise.all(entries.map(async (entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return [full]
  }))).flat()
}

async function replaceIfSmaller(input, temporary, label = 'optimized') {
  const [before, after] = await Promise.all([fs.stat(input), fs.stat(temporary)])
  if (after.size >= before.size * 0.94) {
    await fs.rm(temporary, { force: true })
    return false
  }

  await fs.rename(temporary, input)
  const saved = before.size - after.size
  savedBytes += saved
  console.log(`[deploy] ${label} ${path.relative(distDir, input)}: ${(before.size / 1024 / 1024).toFixed(1)} → ${(after.size / 1024 / 1024).toFixed(1)} MiB`)
  return true
}

async function transcode(input, outputArgs) {
  const extension = path.extname(input)
  const temporary = `${input}.deploy-${process.pid}${extension}`

  try {
    execFileSync('ffmpeg', [
      '-y',
      '-hide_banner',
      '-loglevel', 'error',
      '-i', input,
      '-map_metadata', '-1',
      ...outputArgs,
      temporary,
    ], { stdio: 'inherit' })
    if (await replaceIfSmaller(input, temporary)) optimizedAudio += 1
  } catch (error) {
    await fs.rm(temporary, { force: true }).catch(() => undefined)
    console.warn(`[deploy] media optimization skipped for ${path.relative(distDir, input)}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

async function optimizeAudio() {
  const audioDir = path.join(mediaDir, 'audio')
  let entries
  try {
    entries = await fs.readdir(audioDir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.mp3')) continue
    const file = path.join(audioDir, entry.name)
    const info = await fs.stat(file)
    if (info.size < minAudioBytes) continue

    await transcode(file, [
      '-vn',
      '-c:a', 'libmp3lame',
      '-b:a', '128k',
      '-ar', '44100',
    ])
  }
}

async function optimizeImagesForMobile() {
  let files
  try {
    files = await walk(mediaDir)
  } catch {
    return
  }

  for (const file of files) {
    if (!/\.(?:webp|jpe?g)$/i.test(file)) continue

    const relative = path.relative(mediaDir, file).split(path.sep).join('/')
    if (relative.startsWith('unused/') || relative.startsWith('разбери и не удаля')) continue

    const before = await fs.stat(file)
    let metadata
    try {
      metadata = await sharp(file).metadata()
    } catch {
      continue
    }

    const width = metadata.width ?? 0
    if (before.size < minImageBytes && width <= maxImageWidth) continue

    const extension = path.extname(file).toLowerCase()
    const temporary = `${file}.deploy-${process.pid}${extension}`

    try {
      let pipeline = sharp(file)
        .rotate()
        .resize({ width: maxImageWidth, withoutEnlargement: true })

      if (extension === '.webp') {
        pipeline = pipeline.webp({ quality: 74, effort: 5, smartSubsample: true })
      } else {
        pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true })
      }

      await pipeline.toFile(temporary)
      if (await replaceIfSmaller(file, temporary, 'optimized image')) optimizedImages += 1
    } catch (error) {
      await fs.rm(temporary, { force: true }).catch(() => undefined)
      console.warn(`[deploy] image optimization skipped for ${relative}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

async function transcodeWebmToMp4(relativePath, maxWidth, { muted = false, crf = 27, maxRate = '1800k' } = {}) {
  const input = path.join(distDir, relativePath)
  try {
    await fs.stat(input)
  } catch {
    return
  }

  const output = input.replace(/\.webm$/i, '.mp4')
  const temporary = `${output}.deploy-${process.pid}.mp4`
  const audioArgs = muted
    ? ['-an']
    : ['-c:a', 'aac', '-b:a', '96k']

  try {
    execFileSync('ffmpeg', [
      '-y',
      '-hide_banner',
      '-loglevel', 'error',
      '-i', input,
      '-map_metadata', '-1',
      '-vf', `scale=w='min(${maxWidth},iw)':h=-2`,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', String(crf),
      '-maxrate', maxRate,
      '-bufsize', `${Number.parseInt(maxRate, 10) * 2}k`,
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      ...audioArgs,
      temporary,
    ], { stdio: 'inherit' })

    const [before, after] = await Promise.all([fs.stat(input), fs.stat(temporary)])
    await fs.rename(temporary, output)
    await fs.rm(input)
    savedBytes += before.size - after.size
    convertedVideos += 1
    console.log(`[deploy] converted ${path.relative(distDir, input)} → ${path.relative(distDir, output)}: ${(before.size / 1024 / 1024).toFixed(1)} → ${(after.size / 1024 / 1024).toFixed(1)} MiB`)
  } catch (error) {
    await fs.rm(temporary, { force: true }).catch(() => undefined)
    console.warn(`[deploy] H.264 conversion skipped for ${path.relative(distDir, input)}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

if (!ffmpegAvailable()) {
  console.error('[deploy] ffmpeg is required to create production H.264 video assets')
  process.exit(1)
}

await optimizeImagesForMobile()
await optimizeAudio()
await transcodeWebmToMp4(path.join('media', 'childhood', 'baby-01.webm'), 640, { muted: true })
await transcodeWebmToMp4(path.join('media', 'childhood', 'baby-02.webm'), 720, { muted: true })
await transcodeWebmToMp4(path.join('media', 'friends', 'vadim.webm'), 640, { muted: true, maxRate: '1600k' })
await transcodeWebmToMp4(path.join('media', 'urfu', 'year-2.webm'), 720, { muted: false, crf: 26 })

console.log(`[deploy] media optimization complete; optimized ${optimizedImages} image(s), ${optimizedAudio} audio file(s), converted ${convertedVideos} video file(s), net saved ${(savedBytes / 1024 / 1024).toFixed(1)} MiB`)
