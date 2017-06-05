const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const exec = require('child_process').exec


let testSourceFolder = 'C:/Users/admin/Desktop/Dropbox/FlacConverterNodeJS/FlacTestFolder';
let testTargetFolder = 'C:/Users/admin/Desktop/Test Converter';


class FolderInformation {
    constructor() {
        this.folderData = {
            filesName: [],
            directoriesName: []
        }
        this.arrOfFlies = []
        this.arrOfFlacs = []
    }

    getDirectoriesAndFiles(srcPath) {
        let fileList = fs.readdirSync(srcPath)
        let desPath = ''
        let targetPath = ''
        fileList.forEach((file) => {
            // targetPath = (srcPath) + '/' + file
            desPath = srcPath + '/' + file
            if (fs.statSync(desPath).isDirectory()) {
                // this.folderData.directoriesName.push(targetPath)
                this.getDirectoriesAndFiles(desPath)
            } else {
                // this.folderData.filesName.push(file)
                this.arrOfFlies.push(desPath)
            }
        })
    }

    getFlacFile() {
        this.arrOfFlies.forEach((file, i) => {
            let buffer = readChunk.sync(file, 0, 4100)
            if (!fileType(buffer)) {
                return
            }
            if (fileType(buffer).ext === 'flac') {
                this.arrOfFlacs.push(file)
            }
        })
    }
}

class Converter {

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



let info = new FolderInformation()
info.getDirectoriesAndFiles(testSourceFolder)
info.getFlacFile()


let convert = new Converter()
convert.convert(testTargetFolder, info.arrOfFlacs, '128k')

