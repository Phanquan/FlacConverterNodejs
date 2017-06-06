const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const exec = require('child_process').exec



class FolderInformation {
    constructor() {
        this.folderData = {
            arrOfInputFolder: [],
            arrOfOutputFolder: []
        }
        this.fileData = {
            arrOfInputFiles: [],
            arrOfInputFlacs: [],
            arrOfOutputFiles: [],
            arrOfOutputFlacs: []
        }
    }

    getInputFolderAndFiles(srcPath) {
        let fileList = fs.readdirSync(srcPath),
            desPath = '',
            targetPath = ''
        fileList.forEach((file) => {
            targetPath = (srcPath) + '/' + file
            desPath = srcPath + '/' + file
            if (fs.statSync(desPath).isDirectory()) {
                this.folderData.arrOfInputFolder.push(targetPath)
                this.getInputFolderAndFiles(desPath)
            } else {
                let buffer = readChunk.sync(desPath, 0, 4100)
                if (fileType(buffer) && fileType(buffer).ext === 'flac') {
                    this.fileData.arrOfInputFlacs.push(desPath)
                } else {
                    this.fileData.arrOfInputFiles.push(desPath)
                }
            }
        })
    }

    getOutputFolderAndFiles(sourceFolder, targetFolder) {
        this.folderData.arrOfInputFolder.forEach((data) => {
            this.folderData.arrOfOutputFolder.push(targetFolder + '/' + data.substring(data.indexOf(path.basename(sourceFolder))))
        })
        this.fileData.arrOfInputFiles.forEach((data) => {
            this.fileData.arrOfOutputFiles.push(targetFolder + '/' + data.substring(data.indexOf(path.basename(sourceFolder))))
        })
        this.fileData.arrOfInputFlacs.forEach((data) => {
            this.fileData.arrOfOutputFlacs.push(targetFolder + '/' + data.substring(data.indexOf(path.basename(sourceFolder))))
        })
    }
}

class Converter {
    createOutputFolder(arrayOfOutputFolder, sourcePath, targetPath) {
        let outputFolder = path.basename(sourcePath),
            mkdir = exec(`cd "${targetPath}" && mkdir "${outputFolder}"`)
        arrayOfOutputFolder.forEach((file) => {
            if (!fs.existsSync(file)) {
                let mkdirChild = exec(`cd "${path.dirname(file)}" && mkdir "${path.basename(file)}"`)
            }
        })
    }

    createOutputFiles(arrayOfInputFiles, arrayOfOutputFiles) {
        if (arrayOfInputFiles.length === arrayOfOutputFiles) {
            for (let i = 0; i < arrayOfInputFiles.length; i++) {
                let cpChild = exec(`cp -rf "${arrayOfInputFiles[i]}" "${arrayOfOutputFiles[i]}"`)
            }
        } else {
            throw 'somethings seriously wrong '
        }

    }

    convert(bitRate, arrayOfInputFlacs, arrayOfOutputFlacs) { //eg: 128k
        if (arrayOfInputFlacs.length === arrayOfOutputFlacs) {
            for (var i = 0; i < arrayOfInputFlacs.length; i++) {
                path.basename(arrayOfOutputFlacs[i]).replace('.flac', '.mp3')
                let ffmpeg = exec(`ffmpeg -y -i "${arrayOfInputFlacs[i]}" -ab ${bitRate} -map_metadata 0 -id3v2_version 3 "${arrayOfOutputFlacs[i].replace('.flac', '.mp3')}"`)

                ffmpeg.stdout.on('data', (data) => {
                    console.log(data)
                })

                ffmpeg.stderr.on('data', (data) => {
                    console.log(data)
                })

                ffmpeg.on('close', (code) => {
                    console.log(`Closing code: ${code}`)
                })
            }
        } else {
            throw 'something wrong'
        }
    }
}



let testSourceFolder = 'E:/Lossless Music/Vocaloid Lossloess/40mP - 幸福指数';
let testTargetFolder = 'C:/Users/admin/Desktop/test';

let info = new FolderInformation()
info.getInputFolderAndFiles(testSourceFolder)
info.getOutputFolderAndFiles(testSourceFolder, testTargetFolder)
console.log(info)


let converter = new Converter()
converter.createOutputFolder(info.folderData.arrOfOutputFolder, testSourceFolder, testTargetFolder)
converter.createOutputFiles(info.fileData.arrOfInputFiles,info.fileData.arrOfOutputFiles)
converter.convert('128k',info.fileData.arrOfInputFlacs, info.fileData.arrOfOutputFlacs)


