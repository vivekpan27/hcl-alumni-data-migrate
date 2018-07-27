const async = require('async'),
fs = require('fs'),
csv=require('csvtojson'),
hash = require('object-hash');

let files = [
'json/file0.json', 'json/file1.json', 'json/file2.json', 'json/file3.json', 'json/file4.json', 'json/file5.json', 'json/file6.json', 'json/file7.json', 'json/file8.json', 'json/file9.json', 'json/file10.json'
];

let newCsvMappingJson = fs.readFileSync('json/new_csv_mapping.json');
newCsvMappingJson = JSON.parse(newCsvMappingJson.toString());
let oldCsvMappingJson = fs.readFileSync('json/old_csv_mapping.json');
oldCsvMappingJson = JSON.parse(oldCsvMappingJson.toString());
const oldCsvFilePath = './b.csv';
let oldCsvJson  = {};
let newInsertedData = [];
let newUpdatedData = [];

let performOps = function(file, done) {
  let fileData = fs.readFile(file, function(err, data) {
    jsonFileData = data.toString();
    jsonFileData = JSON.parse(jsonFileData);

    for (var i = jsonFileData.length - 1; i >= 0; i--) {
    // Check if 'id' of new_csv json file exists in the mapping file of old csv.
      if(jsonFileData[i].id in oldCsvMappingJson) {
        oldCsvRowVal = oldCsvMappingJson[jsonFileData[i].id];
        oldCsvRow = oldCsvJson[oldCsvRowVal];
        oldCsvRowHash = hash(oldCsvRow);
        newCsvRowHash = hash(jsonFileData[i]);

        if (oldCsvRowHash != newCsvRowHash) {
          newUpdatedData.push(jsonFileData[i]);
          console.log('Updated!');
        }
      }
      else {
        newInsertedData.push(jsonFileData[i]);
        console.log("Inserted");
      }
    }

    return done(null);
  });
}

async.waterfall([
  function(callback) {
    csv()
      .fromFile(oldCsvFilePath)
      .then((data) => {
        oldCsvJson = data;
        callback(null, oldCsvJson)
      });
  },
  function(oldCsvJson, callback) {
    async.eachLimit(files, 5, performOps, function(err) {
      if (err) throw err;
      console.log(newInsertedData);
      console.log(newUpdatedData);
      let dbData = {};
      dbData.insert = newInsertedData;
      dbData.update = newUpdatedData;
      console.log(JSON.stringify(dbData));
      console.log('Done');
    });
  }
]);
