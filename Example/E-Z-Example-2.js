const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')


let testSourceFolder = 'C:/Users/admin/Desktop/Dropbox/FlacConverterNodeJS/FlacTestFolder'

let recursiveSearch = (srcPath,desPath) => {
    let fileList = fs.readdirSync(srcPath)
    let arr = []
    fileList.forEach((file) => {
        desPath = srcPath + '/' + file
        if (fs.statSync(desPath).isDirectory()) {
            arr = arr.concat(recursiveSearch(desPath))
        } else {
            arr.push(desPath)
        }
    })
    return arr
}

let arrOfFiles = recursiveSearch(testSourceFolder)
// console.log(arrOfFiles)


let getFlacFile = (array) => {
    let arr = []
    array.forEach((file, i) => {
        // console.log(file)
        let buffer = readChunk.sync(file, 0, 4100)
        if (!fileType(buffer)) {
            return;
        }

        if (fileType(buffer).ext === 'flac') {
            arr.push(file.split(' ').join('\\ '))
        }
    })
    return arr
}

let arrOfFlacs = getFlacFile(arrOfFiles)
// console.log(arrOfFlacs)
console.log(arrOfFlacs[2])

