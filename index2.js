// const csv = require("fast-csv");
const fs = require("fs");
const mysql = require('mysql');
const config = require('./config');
const csv=require('csvtojson');
// let file1 = './alumni_sap.csv';
// let file2 = './alumni_sap_2.csv';
let newCsvFile = './a.csv';
let oldCsvFile = './b.csv';
let file1Array = [];
let file2Array = [];


/*
Function is called for old csv file.
*/
function csvToJsonIdRowMapping(file) {
  let fileStream = fs.createReadStream(file);
  let csvArray = [];
  let jsonBreakDown = [];
  let count = 0;
  let id = 0;
  let id_column = -1;
  let id_column_value = 'id';
  let tempjsonObj={}, jsonObj = [];
  let rowNumber = 0;

  let csvStream = csv()
    .on('header', (header) => {
      id_column = header.indexOf(id_column_value);
    })
    .on('data', (data) => {
      const jsonStr = data.toString('utf8');
      tempjsonObj = JSON.parse(jsonStr);
      jsonObj.push({'id' : tempjsonObj['id'], 'row' : rowNumber});

      rowNumber++;
    })
    .on('done', (error)=> {
      fs.writeFile('./json/old_csv_mapping.json', JSON.stringify(jsonObj, null, 2), function(err) {
        if (err) throw err;
      });
    });

  fileStream.pipe(csvStream);
}

/*
Function is called for new csv file.
*/
function csvToJsonIdRowMappingAndCsvSplit(file) {
  let fileStream = fs.createReadStream(file);
  let csvArray = [];
  let jsonBreakDown = [];
  let count = 0;
  let id = 0;
  let id_column = -1;
  let id_column_value = 'id';
  let tempjsonObj={}, jsonObj = [];
  let rowNumber = 0;

  let csvStream = csv()
    .on('header', (header) => {
      id_column = header.indexOf(id_column_value);
    })
    .on('data', (data) => {
      const jsonStr = data.toString('utf8');

      tempjsonObj = JSON.parse(jsonStr);
      jsonObj.push({'id' : tempjsonObj['id'], 'row' : rowNumber});

      jsonBreakDown.push(jsonStr);
      if (jsonBreakDown.length === 10000) {
        fs.writeFile('./json/file' + count + '.json', jsonBreakDown, function(err) {
          if (err) throw err;
          console.log('Created new json file number', count);
        });
        jsonBreakDown = [];
        count++;
      }

      rowNumber++;
    })
    .on('done', (error)=> {
      if (jsonBreakDown.length > 0) {
        fs.writeFile('./json/file' + count + '.json', jsonBreakDown, function(err) {
          if (err) throw err;
        });
      }

      fs.writeFile('./json/new_csv_mapping.json', JSON.stringify(jsonObj, null, 2), function(err) {
        if (err) throw err;
      });
    });

  fileStream.pipe(csvStream);
}

csvToJsonIdRowMappingAndCsvSplit(newCsvFile);
csvToJsonIdRowMapping(oldCsvFile);

// csvToArray(file1).then((result) => {
//   file1Array = result;
//   return csvToArray(file2);
// }).then((result) => {
//   file2Array = result;
//   return compareArray(file1Array, file2Array);
// }).then((result) => {
//   var end_time = Math.round(new Date().getTime()/1000);
//   console.log(end_time - start_time);
//   return dbOps(result);
// }).catch((err) => {
//   console.log('Error : ',err);
// });

