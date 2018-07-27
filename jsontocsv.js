const fs = require('fs')
JsonToCsvParser = require('json2csv').Parser;

fs.readFile('json/db_data_1.json', function(err, data) {
  let jsonData = data.toString();
  jsonData = JSON.parse(jsonData);
  let insertData = jsonData['insert'];

  // for (var i = insertData.length - 1; i >= 0; i--) {
  //   // console.log(insertData[i]);
  //   console.log(Object.values(insertData[i]));

  // }

  let fields = Object.keys(insertData[0]);
  const parserObject = new JsonToCsvParser({fields});
  const csv = parserObject.parse(jsonData['insert']);

  fs.writeFile('csvfile.csv', csv, function(err, data) {
  });

});
