const program = require('caporal')
const fs = require('fs')
const path = require('path')
const Converter = require('./Converter.js').Converter
const FolderInformation = require('./FolderInfomation.js').FolderInformation




program
	.version('1.0.0')
	.command('Folder', 'deploy our command')
	.argument('<bitRate>', 'bitrate of output files - eg: 128k,320k')
	.argument('<inputPath>', 'input path')
	.argument('<outputPath>', 'output path')
	.action(function (args) {
		let testSourceFolder = args.inputPath,
			testTargetFolder = args.outputPath,
			bitrate = args.bitRate

		let info = new FolderInformation()
		info.getInputFolderAndFiles(testSourceFolder)
		info.getOutputFolderAndFiles(testSourceFolder, testTargetFolder)

		let converter = new Converter()
		converter.createOutputFolder(info.folderData.arrOfOutputFolder, testSourceFolder, testTargetFolder)
		converter.createOutputFiles(info.fileData.arrOfInputFiles, info.fileData.arrOfOutputFiles)
		converter.convertFolder(bitrate, info.fileData.arrOfInputFlacs, info.fileData.arrOfOutputFlacs)
	})
	.command('File', 'Convert a single Flac file')
	.argument('<bitRate', 'bitrate of output file')
	.argument('<inputPath>', 'input path')
	.argument('<outputPath>', 'output path')
	.action(function (args) {
		let testSourceFolder = args.inputPath,
			testTargetFolder = args.outputPath,
			bitrate = args.bitRate

		let converter = new Converter()
		converter.convertFile(bitrate, testSourceFolder, testTargetFolder)
	})

program.parse(process.argv)
