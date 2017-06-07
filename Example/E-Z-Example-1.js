const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')


let testSourceFolder = 'C:/Users/admin/Desktop/Dropbox/FlacConverterNodeJS/FlacTestFolder'


let arrOfFiles = []
let arrOfFlacs = []

let recursiveSearch = (srcPath,desPath) => {
    let fileList = fs.readdirSync(srcPath)

    fileList.forEach((file, i) => {
        desPath = srcPath + '/' + file
        if (fs.statSync(desPath).isDirectory()) {
            recursiveSearch(desPath)
        } else {
            arrOfFiles.push(desPath)
        }
    })
}

recursiveSearch(testSourceFolder)
console.log(arrOfFiles)



