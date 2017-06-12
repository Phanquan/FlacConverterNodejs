var probe = require('node-ffprobe');

var track = '/home/phanquan/Desktop/FlacConverterNodejs/Flac Test Files/Asymmetry/06.Mr.Music.flac';

let flacSize = 0;
let flacBitrate = 0;


probe(track, function (err, probeData) {
    console.log(probeData);
    flacBitrate = probeData.format.bit_rate
    flacSize = probeData.format.size
});


setTimeout(function () {
    console.log(flacBitrate)
    console.log(flacSize)
}, 2000);
