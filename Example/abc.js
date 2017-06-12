var probe = require('node-ffprobe');

var track = '/home/superquan/Desktop/FlacConverterNodejs/Flac Test Files/Asymmetry/03.PONPONPON.flac';

let flacSize = 0;
let flacBitrate = 0;


probe(track, function (err, probeData) {
    console.log(probeData);
    flacBitrate=probeData.format.bit_rate
    flacSize=probeData.format.size
    console.log(flacBitrate)
    console.log(flacSize)
});

console.log(flacBitrate)
console.log(flacSize)

// setTimeout(function () {
//     console.log(flacBitrate)
//     console.log(flacSize)
// }, 2000);
