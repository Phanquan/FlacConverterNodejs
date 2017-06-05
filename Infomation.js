const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const exec = require('child_process').exec

exports = class FolderInformation {
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

    getFlacFile(arrOfFlies) {
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