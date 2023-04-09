import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'

export async function createCanvasImage(user, titleOnline, titleIdle, titleDnd, titleOffline) {
    registerFont('assets/fonts/altmannGrotesk.ttf', {
        family: 'altmannGrotesk',
    })
    registerFont('assets/fonts/IdealistaSemiBold.ttf', {
        family: 'idealistaSemiBold',
    })

    const canvas = createCanvas(700, 250)
    const ctx = canvas.getContext('2d')

    const background = await loadImage('assets/images/stats_background.png')
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    let fontSize = 54
    ctx.font = `${fontSize}px "altmannGrotesk"`
    ctx.fillStyle = '#fff'
    const username = user.username
    // online
    ctx.fillStyle = 'rgba(255, 255, 255, .58)'
    ctx.font = `${fontSize}px "idealistaSemiBold"`
    const textWidthOnline = ctx.measureText(titleOnline).width
    const xPosOnline = 196 - (textWidthOnline/2)
    ctx.fillText(titleOnline, xPosOnline, 146)
    // idle
    ctx.fillStyle = 'rgba(255, 255, 255, .58)'
    ctx.font = `${fontSize}px "idealistaSemiBold"`
    const textWidthIdle = ctx.measureText(titleIdle).width
    const xPosIdle = 196 - (textWidthIdle/2)
    ctx.fillText(titleIdle, xPosIdle, 192)
    // dnd
    ctx.fillStyle = 'rgba(255, 255, 255, .58)'
    ctx.font = `${fontSize}px "idealistaSemiBold"`
    const textWidthDnd = ctx.measureText(titleDnd).width
    const xPosDnd = 500 - (textWidthDnd/2)
    ctx.fillText(titleDnd, xPosDnd, 145)
    // offline
    ctx.fillStyle = 'rgba(255, 255, 255, .58)'
    ctx.font = `${fontSize}px "idealistaSemiBold"`
    const textWidthOffline = ctx.measureText(titleOffline).width
    const xPosOffline = 500 - (textWidthOffline/2)
    ctx.fillText(titleOffline, xPosOffline, 193)

    const filename = path.join(
        'assets',
        'images',
        'buffer',
        `${username}${+ '_' + Date.now()}.png`
    )

    // stream in output file
    return new Promise((resolve) => {
        const writeStream = fs.createWriteStream(filename)
        canvas.createPNGStream().pipe(writeStream)
        writeStream.on('finish', () => {
            setTimeout(() => {
                fs.rm(filename, () => {})
            }, 20000)
            resolve(filename)
        })
    })
}
