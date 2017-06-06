const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const exec = require('child_process').exec

exports.FolderInformation = class {
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
