const async = require('async')
const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const exec = require('child_process').exec
const ProgressBar = require('progress-bar')
const probe = require('node-ffprobe')



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
			desPath = ''
		fileList.forEach((file) => {
			desPath = srcPath + '/' + file
			if (fs.statSync(desPath).isDirectory()) {
				this.folderData.arrOfInputFolder.push(desPath)
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
		if (arrayOfInputFiles.length === arrayOfOutputFiles.length) {
			for (let i = 0; i < arrayOfInputFiles.length; i++) {
				let cpChild = exec(`cp -rf "${arrayOfInputFiles[i]}" "${arrayOfOutputFiles[i]}"`)
			}
		} else {
			throw 'somethings seriously wrong '
		}

	}

	convert(bitRate, arrayOfInputFlacs, arrayOfOutputFlacs) { //eg: 128k
		if (arrayOfInputFlacs.length === arrayOfOutputFlacs.length) {
			async.mapSeries(arrayOfInputFlacs, (file, callback) => {
					console.log(`Converting "${path.basename(file)}": `)
					let i = arrayOfInputFlacs.indexOf(file)
					let ffmpeg = exec(`ffmpeg -y -i "${file}" -ab ${bitRate} -map_metadata 0 -id3v2_version 3 "${arrayOfOutputFlacs[i].replace('.flac', '.mp3')}" `)
					ffmpeg.stdout.on('data', (data) => {
						console.log(data)
					})

					ffmpeg.stderr.on('data', (data) => {
						console.log(data)
					})

					ffmpeg.on('close', (code) => {
						console.log(` Done\n`)
						callback()
					})

			}, (err) => {
				if (err) {
					console.log('Errors Happened')
				} else {
					console.log('Completed!')
				}
			})

		} else {
			throw 'something wrong'
		}
	}
	convertFile(bitRate, inputFile, outputFile) {
		console.log(`Converting ${path.basename(inputFile)}`)
		var targetFile = outputFile + '/' + path.basename(inputFile).replace('.flac', '.mp3')

		let ffmpeg = exec(`time ffmpeg -y -i "${inputFile}" -ab ${bitRate} -map_metadata 0 -id3v2_version 3 "${targetFile}"`)

		ffmpeg.stdout.on("data", data => {
			console.log(data)
		})

		ffmpeg.stderr.on("data", data => {
			advance()
		})
		ffmpeg.on('close', (code) => {
			console.log(' Done\n')
		})
	}

}



let testSourceFolder = '/home/superquan/Desktop/FlacConverterNodejs/Flac Test Files';
let testTargetFolder = '/home/superquan/Desktop';

let testSourceFiles = '/home/superquan/Desktop/FlacConverterNodejs/Flac Test Files/Asymmetry/03.PONPONPON.flac'
let testTargetFiles = '/home/superquan/Desktop/outputFolder'


let info = new FolderInformation()
info.getInputFolderAndFiles(testSourceFolder)
info.getOutputFolderAndFiles(testSourceFolder, testTargetFolder)
// console.log(info)


let converter = new Converter()
converter.createOutputFolder(info.folderData.arrOfOutputFolder, testSourceFolder, testTargetFolder)
converter.createOutputFiles(info.fileData.arrOfInputFiles, info.fileData.arrOfOutputFiles)
converter.convert('320k', info.fileData.arrOfInputFlacs, info.fileData.arrOfOutputFlacs)
// converter.convertFile('128k', testSourceFiles, testTargetFiles)


