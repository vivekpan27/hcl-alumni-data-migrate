var async = require('async');
var fs = require('fs');

var arr = [1,2,3,4,5];

var square = function(num, done) {
  var sq = num * num;
  return done(null, sq);
}

var cbk = function(err, data) {
  console.log('Arr ' , data);
}

var file0 = fs.createReadStream('json/file2.json');
var dataArr = [];

file0.on('data', function(data) {
  dataArr += data.toString();
  console.log(JSON.parse(dataArr));

}).on('end', function() {
  console.log(dataArr);
});


// file0.pipe();

// async.map(arr, square, cbk);
