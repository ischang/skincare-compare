$(document).ready(function() {
  // The event listener for the file upload
  document.getElementById('csvFileUpload').addEventListener('input', uploadCsvFile, false);

// Method that checks that the browser supports the HTML5 File API
  function doesBrowserSupportFileUpload() {
    return window.File && window.FileReader && window.FileList && window.Blob;
  }

// Method that reads and processes the selected file
  function uploadCsvFile(event) {
    if (!doesBrowserSupportFileUpload()) {
      alert('Your browser and browser version is not compatible with the File API. Please refer to https://caniuse.com/#feat=filereader');
    } else {
      var data = null;
      var reader = new FileReader();
      reader.readAsText(event.target.files[0]);

      reader.onload = function(csvData) {
        data = $.csv.toObjects(csvData.target.result);
        
        if (data && data.length > 0) {
        	console.log(data);
        	handleData(data);
          alert('Imported -' + data.length + '- rows successfully!');
        } else {
          alert('No data to import!');
        }
      };

      reader.onerror = function() {
        alert('Unable to read ' + file.fileName);
      };
    }
  }

//option 1: to grab complete spreadsheet on both
//option 2: grab spreadsheet with exclusions -- if the ingredient is on the "safe" list, then it will not occur on the "allergic" list
//will only look for keywords of safe/allergic
//if text has water in it, categorize it as water 
  function handleData(csvDataArray) {
  	var safeList = new Object();
  	var allergicList = new Object();

  	csvDataArray.forEach(function (csvObject) {
  		if (csvObject["Result"]) {
  			if(csvObject["Result"] == "Safe") {

  			} else if (csvObject["Result"] == "Allergic") {

  			} else {
  				//
  			}
  		} 
  	});

  }


});