const fs = require('fs')
const path = require('path')
const readChunk = require('read-chunk')
const fileType = require('file-type')
const exec = require('child_process').exec

exports.FolderInformation = class {
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
