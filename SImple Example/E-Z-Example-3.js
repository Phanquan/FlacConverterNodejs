const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')

let testSourceFolder = 'C:/Users/admin/Desktop/Dropbox/FlacConverterNodeJS/FlacTestFolder'
let testTargetFolder = 'C:/Users/admin/Desktop/Test Converter'
let folderData = {
    fileName: [],
    directoryName: []
}


const recursiveSearch = (srcPath) => {
    let fileList = fs.readdirSync(srcPath),
        arr = [],
        desPath = ''

    fileList.forEach((file) => {
        desPath = srcPath + '/' + file
        if (fs.statSync(desPath).isDirectory()) {
            folderData.directoryName.push(desPath)
            arr = arr.concat(recursiveSearch(desPath))
        }
        if (fs.statSync(desPath).isFile()) {
            folderData.fileName.push(file)
            arr.push(desPath)
        }
    })
    return arr
}

let arrOfFiles = recursiveSearch(testSourceFolder)
    // console.log(arrOfFiles)

let xyz = folderData.directoryName.map((x)=>{
    return x = x.substring(0,x.indexOf(path.basename(testSourceFolder)))
})
console.log(xyz)




const getFlacFile = (array) => {
    let arr = []
    array.forEach((file, i) => {
        let buffer = readChunk.sync(file, 0, 4100)
        if (!fileType(buffer)) {
            return
        }

        if (fileType(buffer).ext === 'flac') {
            arr.push(file)
        }
    })
    return arr
}

let arrOfFlacs = getFlacFile(arrOfFiles)
    // console.log(arrOfFlacs)
