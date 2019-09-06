let waterList = ["aqua", "eau", "water", "h20", "purified water"];
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
    let data = null;
    let reader = new FileReader();
    reader.readAsText(event.target.files[0]);

    reader.onload = function (csvData) {
      data = $.csv.toObjects(csvData.target.result);

      if (data && data.length > 0) {
        handleData(data).then(function(dataLists) {
          lists = dataLists;
          setDataAsTable(dataLists.sharedList, "sharedList");

          if(errors.length > 0) {
            console.log("There are errors");
          } else {
            console.log('Imported -' + data.length + '- rows successfully!');
          }
        });

        // setDataAsTable(lists.safeList, "safeList");
        // setDataAsTable(lists.allergicList, "allergicList");
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

function isDefaultList(listname) {
  if (listname == "safeList") {
    console.log(document.getElementById("safeRadio").checked);
    return document.getElementById("safeRadio").checked;
  } else if (listname == "allergicList") {
    return document.getElementById("allergicRadio").checked;
  }
}

function download(filename, listName, event) {
  event.preventDefault();

  if (Object.keys(lists).length == 0) {
    window.alert("You need to upload a CSV first!");
  }

  if (listName != "sharedList" && !isDefaultList(listName)) {
    listName = listName+"Exclusive";
  }

  let csvContent = createCsvContent(sortIngredientListAsArray(lists[listName]));
  let blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});

  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  }

  else{
    let elem = window.document.createElement('a');

    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;

    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
}

function createCsvContent(list) {
  let lineArray = [];

  lineArray.push("Ingredient,#");

  console.log(list);
  list.forEach(function (infoArray) {
    lineArray.push(infoArray.join(","));
  });

  return lineArray.join("\n");
}
