const program = require("caporal");
const Converter = require('Converter.js')
const Infomation = require('Infomation.js')
program
	.version("1.0.0")
	.command("Folder", "deploy our command")
	.help("Convert the whole Folder")
	.argument("<bitRate>", "bitrate of output file - eg: 128k,320k")
	.argument("<inputPath>", "input path")
	.argument("<outputPath>", "output path")
	.action(function (args) {
		let testSourceFolder = "E:/Lossless Music/Vocaloid Lossloess/40mP - 幸福指数";
		let testTargetFolder = "C:/Users/admin/Desktop/Test Converter";
		let bitrate = args.bitRate;
		let inputPath = args.inputPath;
		let outputPath = args.outputPath;
		console.log("Bitrate: ", bitrate);
		console.log("Input Path: ", inputPath);
		console.log("Output Path: ", outputPath);
	});

program.parse(process.argv);
