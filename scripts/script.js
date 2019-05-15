let waterList = ["aqua", "eau", "water", "h20"];
let goodWords = ["safe", "good", "yes"];
let badWords = ["allergic", "bad", "no"];
let errors = [];
let lists = {};

// Method that reads and processes the selected file
function uploadCsvFile(event) {
  if (!doesBrowserSupportFileUpload()) {
    console.log("Your brower is not compatible")
    errors.push('Your browser/browser version is not compatible with the File API. Please refer to https://caniuse.com/#feat=filereader');
  } else {
    var data = null;
    var reader = new FileReader();
    reader.readAsText(event.target.files[0]);

    reader.onload = function (csvData) {
      data = $.csv.toObjects(csvData.target.result);

      if (data && data.length > 0) {
        lists = handleData(data);

        setDataAsTable(lists.safeList, "safeList");
        setDataAsTable(lists.allergicList, "allergicList");
        setDataAsTable(lists.sharedList, "sharedList");

        if(errors.length > 0) {
          console.log("There are errors");
        } else {
          console.log('Imported -' + data.length + '- rows successfully!');
        }
      } else {
        errors.push("No data to import!");
        console.log('No data to import!');
      }
    };

    reader.onerror = function () {
      errors.push("Unable to read file");
      console.log('Unable to read ' + file.fileName);
    };
  }

  if (errors.length > 0) {
    console.log(errors);
  }
}

// Method that checks that the browser supports the HTML5 File API
function doesBrowserSupportFileUpload() {
  return window.File && window.FileReader && window.FileList && window.Blob;
}

function setFileNameOnUpload(file) {
  $('#uploadFileInfo').val(file.files[0].name)
}

function download(filename, listName, event) {
  event.preventDefault();

  if (Object.keys(lists).length == 0) {
    window.alert("You need to upload a CSV first!");
  }

  let csvContent = createCsvContent(sortIngredientListAsArray(lists[listName]));
  csvContent = csvContent.replace(/[\u0300-\u036f]/g, "")
  let blob = new Blob([csvContent], {type: 'text/csv'});

  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  }

  else{
    let elem = window.document.createElement('a');

    elem.href = window.URL.createObjectURL(blob);

    // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));

    elem.download = filename;

    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

function createCsvContent(list) {
  let lineArray = [];

  lineArray.push("Ingredient,#");

  list.forEach(function (infoArray) {
    lineArray.push(infoArray.join(","));
  });

  return lineArray.join("\n");
}
