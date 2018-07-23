var csv = require('csv');
var generate = require('csv').generate;
var data = [];
var generator = generate({seed:1, columns:2, length:2, objectMode: true});
var diff = require("fast-array-diff");


generator.on('readable', function() {
  while(d = generator.read()) {
    data.push(d);
  }
});


generator.on('error', function(err) {
  console.log(err);
});

generator.on('end', function() {
  // data.should.eql([ [ 'OMH', 'ONKCHhJmjadoA' ],[ 'D', 'GeACHiN' ] ]);
  // console.log(data);
});

var a1 = [
  [1,2,3],
  [4,5,6],
];

var a2 = [
  [1,2],
  [4,6],
];

var a = diff.diff(a1,a2);
// console.log(a);

var es = diff.getPatch(a1, a2);
console.log(es);
// generate({seed:5, columns:2, length:100 }, function(err, output) {
  // console.log(output);
  // output.should.eql('OMH,ONKCHhJmjadoA\nD,GeACHiN');
// });
