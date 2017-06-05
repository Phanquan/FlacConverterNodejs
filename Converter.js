const exec = require('child_process').exec

exports = class Converter {

    convert(targetPath, arrayOfFlacs, bitRate) { //eg: 128k
        arrayOfFlacs.forEach((file) => {
            let targetFile = targetPath + '/' + path.basename(file).replace('.flac', '.mp3')
            let ffmpeg = exec(`ffmpeg -i "${file}" -ab ${bitRate} -map_metadata 0 -id3v2_version 3 "${targetFile}"`)

            ffmpeg.stdout.on('data', (data) => {
                console.log(data)
            })

            ffmpeg.stderr.on('data', (data) => {
                console.log(data)
            })

            ffmpeg.on('close', (code) => {
                console.log(`Closing code: ${code}`)
            })
        })
    }
}

