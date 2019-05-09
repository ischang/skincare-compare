var waterList = ["aqua", "eau", "water", "h20"];
var goodWords = ["safe", "good", "yes"];
var badWords = ["allergic", "bad", "no"];
var errors = [];
var lists;

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

function download(filename, listName) {
  console.log(lists[listName]);
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=UTF-8' + encodeURIComponent());
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
