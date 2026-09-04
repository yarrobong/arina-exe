import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { optimize } from 'svgo'

const svgPath = path.resolve('public/media/opera-ballet-map.svg')
const webpPath = path.resolve('public/media/opera-ballet-map.webp')
const source = await fs.readFile(svgPath, 'utf8')
const result = optimize(source, { multipass: true, path: svgPath })

await fs.writeFile(svgPath, result.data)
await sharp(Buffer.from(result.data), { density: 144 })
  .resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 88, effort: 6, smartSubsample: true })
  .toFile(webpPath)

const [svgInfo, webpInfo] = await Promise.all([fs.stat(svgPath), fs.stat(webpPath)])
console.log(`[theater-map] SVG ${(svgInfo.size / 1024).toFixed(0)} KiB; deploy WebP ${(webpInfo.size / 1024).toFixed(0)} KiB`)
