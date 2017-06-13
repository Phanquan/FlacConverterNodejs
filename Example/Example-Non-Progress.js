const async = require('async')
const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const exec = require('child_process').exec
const ProgressBar = require('progress-bar')
const probe = require('node-ffprobe')



class FolderInformation {
	//Phương thức khởi tạo
	constructor() {
		// Khai báo folderData là đối tượng có 2 thuộc tính.
		this.folderData = {
			arrOfInputFolder: [],	//Mảng chứa path của các folder input
			arrOfOutputFolder: []	//Mảng chứa path của các folder output
		}

		//khai báo fileData là đối tượng có 4 thuộc tính.
		this.fileData = {
			arrOfInputFiles: [],	//Mảng chứa path của các file input
			arrOfInputFlacs: [],	//Mảng chứa path của các flac input
			arrOfOutputFiles: [],	//Mảng chứa path của các file output
			arrOfOutputFlacs: []	//Mảng chứa path của các flac output
		}
	}
	// method


	getInputFolderAndFiles(srcPath) {
		// tạo mảng chứa các file và folder con của inputFolder,dùng fs.readdir
		let fileList = fs.readdirSync(srcPath),
			desPath = ''
		fileList.forEach((file) => {// lặp từng file trong fileList
			//tạo desPath là đường dẫn của file và folder con
			desPath = srcPath + '/' + file
			//nếu desPath là folder 
			if (fs.statSync(desPath).isDirectory()) {
				//thì đẩy vào mảng folder input
				this.folderData.arrOfInputFolder.push(desPath)
				//và thực hiện đệ quy để lấy tất cả folder
				this.getInputFolderAndFiles(desPath)
			} else { //nếu không phải folder (tức là file)
				//tạo biến đọc Magic Number
				let buffer = readChunk.sync(desPath, 0, 4100)
				//Nếu biến hỗ trợ dạng Magic Number và là Flac
				if (fileType(buffer) && fileType(buffer).ext === 'flac') {
					//thì đẩy vào mảng file input
					this.fileData.arrOfInputFlacs.push(desPath);
				} else {
					//các file còn lại đẩy vào mảng file input
					this.fileData.arrOfInputFiles.push(desPath);
				}
			}
		})
	}

	//phương thức lấy output file,folder và flac
	// tham số là inputFolder và outputFolder
	getOutputFolderAndFiles(sourceFolder, targetFolder) {
		this.folderData.arrOfInputFolder.forEach((data) => { // lặp từng data trong mảng
			this.folderData.arrOfOutputFolder.push(targetFolder + '/' + data.substring(data.indexOf(path.basename(sourceFolder))))
		}) // Đẩy từng data là outputFolder vào mảng data folder
		this.fileData.arrOfInputFiles.forEach((data) => {// lặp từng data trong mảng
			this.fileData.arrOfOutputFiles.push(targetFolder + '/' + data.substring(data.indexOf(path.basename(sourceFolder))))
		})// Đẩy từng data là outputFiles vào mảng data files
		this.fileData.arrOfInputFlacs.forEach((data) => {// lặp từng data trong mảng
			this.fileData.arrOfOutputFlacs.push(targetFolder + '/' + data.substring(data.indexOf(path.basename(sourceFolder))))
		})// Đẩy từng data là outputFlacs vào mảng data Flacs
	}
}

class Converter {
	// method tạo folder ở ouput với cấu trúc giống input
	createOutputFolder(arrayOfOutputFolder, sourcePath, targetPath) {
		let outputFolder = path.basename(sourcePath), // lấy base name của thư mục đầu vào
			// tạo thư mục tổng ở đầu ra chứa tất cả các file và folder.
			mkdir = exec(`cd "${targetPath}" && mkdir "${outputFolder}"`)
		// sử dụng vòng lặp mapSeries để tạo các folder con ở đầu ra một các tuần tự
		async.mapSeries(arrayOfOutputFolder, (file, callback) => {
			if (!fs.existsSync(file)) {// kiểm tra xem ở đường dẫn có thư mục đó chưa ?
				// tạo child-process để cd tới đường dẫn trước đó (dirname) và tạo thư mục con theo basename
				let mkdirChild = exec(`cd "${path.dirname(file)}" && mkdir "${path.basename(file)}"`)
				// khi child-process kết thúc
				mkdirChild.on('close', (code) => {
					// sau khi thực hiện xong một child-process thì callback để thực hiện tiếp child-process tiếp theo
					callback()
				})
			}
		}, (err) => {
			if (err) console.log(err)
		})
	}

	// method copy tất cả file (ko flac) ở thư mục đầu vào chuyển sang thưc mục đầu ra.
	createOutputFiles(arrayOfInputFiles, arrayOfOutputFiles) {
		if (arrayOfInputFiles.length === arrayOfOutputFiles.length) {
			for (let i = 0; i < arrayOfInputFiles.length; i++) {
				// thực hiện copy đè lên các file có sẵn ở đó nếu trùng tên.
				let cpChild = exec(`cp -rf "${arrayOfInputFiles[i]}" "${arrayOfOutputFiles[i]}"`)
			}
		} else {
			throw 'somethings seriously wrong '
		}

	}

	convertFolder(bitRate, arrayOfInputFlacs, arrayOfOutputFlacs) { //eg: 128k
		if (arrayOfInputFlacs.length === arrayOfOutputFlacs.length) {
			// dùng async mapseries để lặp tuần tự
			async.mapSeries(arrayOfInputFlacs, (inputFlac, callback) => {

				console.log(`Converting "${path.basename(inputFlac)}": `)

				let i = arrayOfInputFlacs.indexOf(inputFlac) // lấy index của file flac , để lấy ra cùng phần tử i trong mảng output
				// tạo child-process để convert flac
				let ffmpeg = exec(`ffmpeg -y -i "${inputFlac}" -ab ${bitRate} -map_metadata 0 -id3v2_version 3 "${arrayOfOutputFlacs[i].replace('.flac', '.mp3')}" `)

				ffmpeg.stdout.on('data', (data) => {
					console.log(data)
				})

				ffmpeg.stderr.on('data', (data) => {
					console.log(data)
				})

				ffmpeg.on('close', (code) => {
					console.log(` Done\n`) // khi hoàn thành thì log ra done
					callback()// callback để thực hiện child-process tiếp theo
				})
			}, (err) => {
				if (err) {
					console.log('Errors Happened: ', err)
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
		let targetFile = outputFile + '/' + path.basename(inputFile).replace('.flac', '.mp3')

		//khởi tạo child-process để convert file flac sang mp3
		let ffmpeg = exec(`time ffmpeg -y -i "${inputFile}" -ab ${bitRate} -map_metadata 0 -id3v2_version 3 "${targetFile}"`)

		ffmpeg.stdout.on("data", data => {
			console.log(data)
		})
		ffmpeg.stderr.on("data", data => {
			console.log(data)
		})
		ffmpeg.on('close', (code) => {
			console.log(' Done\n')// close process-child
		})
	}

}


// inputFolder và outputFolder
let testSourceFolder = '/home/superquan/Desktop/FlacConverterNodejs/Flac Test Files';
let testTargetFolder = '/home/superquan/Desktop';

//inputFile và outputFile
let testSourceFiles = '/home/superquan/Desktop/FlacConverterNodejs/Flac Test Files/Asymmetry/03.PONPONPON.flac'
let testTargetFiles = '/home/superquan/Desktop/outputFolder'

// khởi tạo instance info của class FolderInformation và lấy thông tin
let info = new FolderInformation()
info.getInputFolderAndFiles(testSourceFolder)
info.getOutputFolderAndFiles(testSourceFolder, testTargetFolder)
// console.log(info)

//khởi tạo instance converter của class Converter và thực hiện convert
let converter = new Converter()

//tạo folder ở ouput và copy file sang đó
converter.createOutputFolder(info.folderData.arrOfOutputFolder, testSourceFolder, testTargetFolder)
converter.createOutputFiles(info.fileData.arrOfInputFiles, info.fileData.arrOfOutputFiles)

// Chọn 1 trong 2:
// Convert cả folder
converter.convertFolder('128k', info.fileData.arrOfInputFlacs, info.fileData.arrOfOutputFlacs)

// Chỉ convert file
// converter.convertFile('128k', testSourceFiles, testTargetFiles)


