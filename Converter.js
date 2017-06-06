const exec = require("child_process").exec
const path = require('path')
const fs = require('fs')

exports.Converter = class {
	createOutputFolder(arrayOfOutputFolder, sourcePath, targetPath) {
		let outputFolder = path.basename(sourcePath),
			mkdir = exec(`cd "${targetPath}" && mkdir "${outputFolder}"`)
		arrayOfOutputFolder.forEach(file => {
			if (!fs.existsSync(file)) {
				let mkdirChild = exec(
					`cd "${path.dirname(file)}" && mkdir "${path.basename(file)}"`
				)
			}
		})
	}

	createOutputFiles(arrayOfInputFiles, arrayOfOutputFiles) {
		// if (arrayOfInputFiles.length === arrayOfOutputFiles) {
		for (let i = 0; i < arrayOfInputFiles.length; i++) {
			let cpChild = exec(
				`cp -rf "${arrayOfInputFiles[i]}" "${arrayOfOutputFiles[i]}"`
			)
		}

	}

	convertDirectory(bitRate, arrayOfInputFlacs, arrayOfOutputFlacs) {
		//eg: 128k
		// if (arrayOfInputFlacs.length === arrayOfOutputFlacs) {
		for (var i = 0; i < arrayOfInputFlacs.length; i++) {
			path.basename(arrayOfOutputFlacs[i]).replace(".flac", ".mp3")
			let ffmpeg = exec(`ffmpeg -y -i "${arrayOfInputFlacs[i]}" -ab ${bitRate} -map_metadata 0 -id3v2_version 3 "${arrayOfOutputFlacs[i].replace(".flac", ".mp3")}"`)

			ffmpeg.stdout.on("data", data => {
				console.log(data)
			})

			ffmpeg.stderr.on("data", data => {
				console.log(data)
			})

			ffmpeg.on("close", code => {
				console.log(`Closing code: ${code}`)
			})
		}
		// } else {
		// 	throw "something wrong"
		// }
	}

	convertFile(bitRate, inputFile, outputFile) {
		let targetFile = outputFile + '/' + path.basename(inputFile).replace('.flac', '.mp3'),
			ffmpeg = exec(`ffmpeg -y -i "${inputFile}" -ab ${bitRate} -map_metadata 0 -id3v2_version 3 "${targetFile}"`)

		ffmpeg.stdout.on("data", data => {
			console.log(data)
		})

		ffmpeg.stderr.on("data", data => {
			console.log(data)
		})

		ffmpeg.on("close", code => {
			console.log(`Closing code: ${code}`)
		})
	}
}
