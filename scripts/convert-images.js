const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const picturesDir = path.join(__dirname, '..', 'source', 'pictures')

const files = fs.readdirSync(picturesDir).filter(f =>
  /^ground[23]\s*\(\d+\)\.jpg$/i.test(f)
)

async function convertAll() {
  for (const file of files) {
    const inputPath = path.join(picturesDir, file)
    const baseName = path.basename(file, path.extname(file))
    const webpPath = path.join(picturesDir, baseName + '.webp')
    const thumbPath = path.join(picturesDir, 'thumb-' + baseName + '.webp')
    const thumbJpgPath = path.join(picturesDir, 'thumb-' + file)

    if (!fs.existsSync(webpPath)) {
      await sharp(inputPath).webp({ quality: 80 }).toFile(webpPath)
      const origSize = (fs.statSync(inputPath).size / 1024).toFixed(1)
      const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(1)
      console.log(`[WebP] ${file}  ${origSize}KB -> ${baseName}.webp  ${webpSize}KB  (${((1 - webpSize / origSize) * 100).toFixed(0)}%)`)
    }

    if (!fs.existsSync(thumbPath)) {
      await sharp(inputPath).resize(30).webp({ quality: 60 }).toFile(thumbPath)
      const thumbSize = (fs.statSync(thumbPath).size / 1024).toFixed(1)
      console.log(`[LQIP] ${file} -> thumb-${baseName}.webp  ${thumbSize}KB`)
    }

    if (!fs.existsSync(thumbJpgPath)) {
      await sharp(inputPath).resize(400).jpeg({ quality: 75 }).toFile(thumbJpgPath)
      const thumbJpgSize = (fs.statSync(thumbJpgPath).size / 1024).toFixed(1)
      console.log(`[Thumb] ${file} -> thumb-${file}  ${thumbJpgSize}KB`)
    }
  }
  console.log('\nDone!')
}

convertAll().catch(console.error)
