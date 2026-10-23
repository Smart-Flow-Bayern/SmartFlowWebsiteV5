// Erzeugt app/icon.svg, app/apple-icon.png (180×180) und app/favicon.ico aus der Bildmarke. Neu erzeugen: pnpm brand:icons
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { IMPULSE_PATH, IMPULSE_STROKE } from '../lib/brand/marks.ts'
import { colors } from '../lib/brand/tokens.ts'

const root = process.cwd()
const trace = `<path d="${IMPULSE_PATH}" fill="none" stroke="${colors.accent}" stroke-width="${IMPULSE_STROKE}" stroke-linecap="square" stroke-linejoin="miter"/>`

// Tinte der Bildmarke im 32er-Raster: x 1–31, y 9–21 (Strichbreite und eckige Enden eingerechnet)
const INK = { x: 1, y: 9, width: 30, height: 12 }

/** Quadratisches Icon: Bildmarke mittig auf Hintergrund, Tintenbreite = `share` der Kantenlänge. */
function iconSvg(edge: number, share: number): string {
  const scale = (edge * share) / INK.width
  const tx = edge / 2 - (INK.x + INK.width / 2) * scale
  const ty = edge / 2 - (INK.y + INK.height / 2) * scale
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${edge} ${edge}" width="${edge}" height="${edge}">` +
    `<rect width="${edge}" height="${edge}" fill="${colors.ground}"/>` +
    `<g transform="translate(${tx} ${ty}) scale(${scale})">${trace}</g></svg>\n`
  )
}

// Favicon: Originalraster, um 1 nach unten versetzt, damit die Tinte (y 9–21) mittig sitzt
const icon =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">` +
  `<rect width="32" height="32" fill="${colors.ground}"/>` +
  `<g transform="translate(0 1)">${trace}</g></svg>\n`
writeFileSync(join(root, 'app/icon.svg'), icon)

const apple = await sharp(Buffer.from(iconSvg(180, 0.6))).png().toBuffer()
writeFileSync(join(root, 'app/apple-icon.png'), apple)

// favicon.ico mit einem eingebetteten 32×32-PNG (ICO-Header 6 Byte + Verzeichniseintrag 16 Byte)
const png32 = await sharp(Buffer.from(icon)).resize(32, 32).png().toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0) // reserviert
header.writeUInt16LE(1, 2) // Typ: Icon
header.writeUInt16LE(1, 4) // Anzahl Bilder
header.writeUInt8(32, 6) // Breite
header.writeUInt8(32, 7) // Höhe
header.writeUInt16LE(1, 10) // Farbebenen
header.writeUInt16LE(32, 12) // Bit pro Pixel
header.writeUInt32LE(png32.length, 14) // Bildgröße
header.writeUInt32LE(22, 18) // Versatz der Bilddaten
writeFileSync(join(root, 'app/favicon.ico'), Buffer.concat([header, png32]))

console.log('app/icon.svg, app/apple-icon.png, app/favicon.ico geschrieben')
