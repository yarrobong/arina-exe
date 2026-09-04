import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const mediaDir = path.join(distDir, 'media')
const minAudioBytes = 1500 * 1024
let savedBytes = 0
let optimized = 0

function ffmpegAvailable() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

async function replaceIfSmaller(input, temporary) {
  const [before, after] = await Promise.all([fs.stat(input), fs.stat(temporary)])
  if (after.size >= before.size * 0.94) {
    await fs.rm(temporary, { force: true })
    return false
  }

  await fs.rename(temporary, input)
  const saved = before.size - after.size
  savedBytes += saved
  optimized += 1
  console.log(`[deploy] optimized ${path.relative(distDir, input)}: ${(before.size / 1024 / 1024).toFixed(1)} → ${(after.size / 1024 / 1024).toFixed(1)} MiB`)
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
    await replaceIfSmaller(input, temporary)
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

async function optimizeWebm(relativePath, maxWidth, { muted = false, crf = 37 } = {}) {
  const file = path.join(distDir, relativePath)
  try {
    const info = await fs.stat(file)
    if (info.size < 1024 * 1024) return
  } catch {
    return
  }

  const audioArgs = muted
    ? ['-an']
    : ['-c:a', 'libopus', '-b:a', '96k']

  await transcode(file, [
    '-vf', `scale=w='min(${maxWidth},iw)':h=-2`,
    '-c:v', 'libvpx-vp9',
    '-crf', String(crf),
    '-b:v', '0',
    '-deadline', 'good',
    '-cpu-used', '5',
    '-row-mt', '1',
    '-pix_fmt', 'yuv420p',
    ...audioArgs,
  ])
}

if (!ffmpegAvailable()) {
  console.log('[deploy] ffmpeg unavailable; media transcode skipped')
  process.exit(0)
}

await optimizeAudio()
await optimizeWebm(path.join('media', 'childhood', 'baby-02.webm'), 720, { muted: true, crf: 37 })
await optimizeWebm(path.join('media', 'friends', 'vadim.webm'), 640, { muted: true, crf: 37 })
await optimizeWebm(path.join('media', 'urfu', 'year-2.webm'), 720, { muted: false, crf: 35 })

console.log(`[deploy] media optimization complete; optimized ${optimized} file(s), saved ${(savedBytes / 1024 / 1024).toFixed(1)} MiB`)
