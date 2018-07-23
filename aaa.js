const fs = require('fs');
const csv = require('fast-csv');


main();

function main() {

   // let file1 = './alumni_sap.csv';
   // let file2 = './alumni_sap_2.csv';
   let file1 = './a.csv';
   let file2 = './b.csv';
   let file1Array = [];
   let file2Array = [];

   csvToArray(file1).then((result) => {
       file1Array = result;
       return csvToArray(file2);
   }).then((result) => {
       file2Array = result;
       // console.log('file1 : ',file1Array);
       // console.log('file2 : ',file2Array);
        return compareArray(file1Array, file2Array);
   }).then((result) => {
       console.log(result);
   }).catch((err) => {
       console.log('Error : ',err);
   });

}


function csvToArray(fileName) {
   return new Promise((resolve, reject) => {
       let array = [];
       let fileStream = fs.createReadStream(fileName);

       let csvStream = csv()
       .on("data", (data) => {
           array.push(data);
       })
       .on("end", () => {
           resolve(array);
       });
       fileStream.pipe(csvStream);
   });
}

function compareArray(arr1, arr2) {
   return new Promise((resolve, reject) => {

       let length = 0;

       if (arr1.length < arr2.length) {
        length = arr1.length;
        mark = 1;
       }
       else if (arr2.length <  arr1.length){
        length = arr2.length;
        mark = 2;
       }
       else {
        length = arr1.length;
        mark = 3;
       }

       let arr = [];
       let index = 1;

       for (; index < length; index++) {
           let subArrLength = arr1[index].length > arr2[index].length ? arr1[index].length : arr2[index].length;

           for ( let subIndex = 0; subIndex < subArrLength; subIndex ++) {
               if (arr1[index][subIndex] != arr2[index][subIndex]) {
                   arr.push(arr2[index]);
                   break;
               }
           }
      }

      if (mark == 1) {
        for (var i = length; i < arr2.length; i++) {
          arr.push(arr2[i]);
        }
      }
      else if (mark == 2) {
        for (var i = length; i < arr1.length; i++) {
          arr.push(arr1[i]);
        }
      }


      console.log(arr);

       if(index >= length) {
           resolve("done");
       }

   });
}
