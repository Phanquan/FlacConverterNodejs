
// let x = 'C:/Users/admin/Desktop/Dropbox/FlacConverterNodeJS/FlacTestFolder/EXIT TUNES PRESENTS GUMish from Megpoid/scans + log/02_02.jpg'
// console.log(x.split(/// | /).join('/ '))

// const path = require('path')

// let y= path.basename('C:/Users/admin/Desktop/Dropbox/FlacConverterNodeJS/FlacTestFolder')
// console.log(y)



// const readChunk = require('read-chunk');
// const fileType = require('file-type');
// const buffer = readChunk.sync('C:/Users/admin/Desktop/Dropbox/FlacConverterNodejs/test/Asymmetry/03.PONPONPON', 0, 4100);
 
// console.log(fileType(buffer));
//=> {ext: 'png', mime: 'image/png'} 



// const exec = require('child_process').exec

// let sourcePath = 'C:/Users/admin/Desktop/Dropbox/FlacConverterNodeJS/FlacTestFolder/'
// let targetPath = 'C:/Users/admin/Desktop/Test Converter'
// 


// add function


// arrOfFlacs.forEach((file) => {


//     let targetFile = targetPath + '/' + path.basename(file).replace('.flac','.mp3')
//     let ffmpeg = exec(`ffmpeg -i "${file}" -ab 128k -map_metadata 0 -id3v2_version 3 "${targetFile}"`)


//     ffmpeg.stdout.on('data', function(data) {
//         console.log('stdout: ' + data)
//     })
//     ffmpeg.stderr.on('data', function(data) {
//         console.log('stdout: ' + data)
//     })
//     ffmpeg.on('close', function(code) {
//         console.log('closing code: ' + code)
//     })

// })

// 
// 
// 
// const dirTree = (filename) => {
//     let stats = fs.lstatSync(filename),
//         info = {
//             path: filename,
//             name: path.basename(filename)
//         }

//     if (stats.isDirectory()) {
//         info.type = "folder"
//         info.children = fs.readdirSync(filename).map((child) => {
//             return dirTree(filename + '/' + child)
//         })
//     } else {
//         info.type = "file"
//     }

//     return info
// }

// let jsonData = dirTree(testSourceFolder)
//     // console.log(jsonData)

    // getOutputFolderAndFiles(sourceFolder, targetFolder) {
    //     return this.folderData.arrOfInputFolder.map((folder) => {
    //         return this.folderData.arrOfOutputFolder.push(targetFolder + '/' + folder.substring(folder.indexOf(path.basename(sourceFolder))))
    //     })
    // }

    // getOutputFiles(sourceFolder, targetFolder) {
    //     return this.fileData.arrOfInputFiles.map((file) => {
    //         return this.fileData.arrOfOutputFiles.push(targetFolder + '/' + file.substring(file.indexOf(path.basename(sourceFolder))))
    //     })
    // }

    // getOutputFlacs(sourceFolder, targetFolder){
    //     return this.fileData.arrOfInputFlacs.map((file) => {
    //         return this.fileData.arrOfOutputFlacs.push(targetFolder + '/' + file.substring(file.indexOf(path.basename(sourceFolder))))
    //     })
    // }
    // 
    // 
    const spawn = require('child_process').spawn;
const ls = spawn('ipconfig', ['/all']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
