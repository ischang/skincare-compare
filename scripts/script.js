let waterList = ["aqua", "eau", "water", "h20", "purified water", "water purified"];
let goodWords = ["safe", "good", "yes"];
let badWords = ["allergic", "bad", "no"];
let isNotExclusiveListNames = ["sharedList", "quickCompareSharedList", "quickCompareUniqueList"];
let lists = {};

/*
uploadCsvFile:
  Purpose: main call function for uploading the .csv and handling data

  - Given an event
    - Checks browser support file upload method
    - Grabs the uploaded csv and transforms it to an object
    - Calls handleData
*/
function uploadCsvFile(event) {
  if (!doesBrowserSupportFileUpload()) {
    window.alert("Your browser/browser version is not compatible with file uploading. Please refer to https://caniuse.com/#feat=filereader");
    console.log("Your browser/browser version is not compatible with the File API. Please refer to https://caniuse.com/#feat=filereader")
  } else {
    let data = null;
    let reader = new FileReader();
    reader.readAsText(event.target.files[0]);

    reader.onload = function (csvData) {
      data = $.csv.toObjects(csvData.target.result);

      if (data && data.length > 0) {
        let promises = handleData(data);

        Promise.all(promises).then(function(result){
          lists["sharedList"] = result[0].sharedList;
          lists["allergicList"] = result[1].safeAllergicLists.allergicList;
          lists["safeList"] = result[1].safeAllergicLists.safeList;
          lists["allergicListExclusive"] = result[1].exclusiveLists.allergicListExclusive;
          lists["safeListExclusive"] = result[1].exclusiveLists.safeListExclusive;

          setDataAsTable(lists.sharedList, "sharedList", true);
          setDataAsTable(lists.safeList, "safeList", true);
          setDataAsTable(lists.allergicList, "allergicList", true);
        }).catch(function(errors){
          console.log("uploadCsvFile in promise: " + errors);
          console.log("uploadCsvFile promises: "  + promises);
        });
      } else {
        console.log('uploadCsvFile: no data to import!');
      }
    };

    reader.onerror = function () {
      console.log('uploadCsvFile: unable to read ' + file.fileName);
    };
  }
}

/*
doesBrowserSupportFileUpload:
  Purpose: checks if user's browser and browser version for file upload functionality
*/
function doesBrowserSupportFileUpload() {
  return window.File && window.FileReader && window.FileList && window.Blob;
}

/*
setFileNameOnUpload:
  Purpose: shows user the file name that they uploaded
*/
function setFileNameOnUpload(file) {
  $('#uploadFileInfo').val(file.files[0].name)
}

/*
isDefaultList:
  Purpose: checks if radios were checked in each category

  - Given a listname
    - If the list is a safeList, check if the safeRadio was checked
      - If not, it is a safe exclusive list
    - Same for allergicList
*/
function isDefaultList(listname) {
  if (listname == "safeList") {
    return document.getElementById("safeRadio").checked;
  } else if (listname == "allergicList") {
    return document.getElementById("allergicRadio").checked;
  }
}

/*
download:
  Purpose: lets the user download a .csv from memory

  - Given a filename, listname, quickCompare boolean, and the event
    - Checks if the user didn't input anything
    - Checks if it's an exclusive list or not
    - Create the csv content using Blob (and if it's a quick compare, make according changes,
      such as no count header)
    - Create an anchor element to allow download
*/
function download(filename, listName, quickCompare, event) {
  event.preventDefault();

  if (Object.keys(lists).length == 0) {
    window.alert("You didn't input anything as a CSV file or any text yet!");
    console.log("download: lists was empty.")
  }

  if (!isNotExclusiveListNames.includes(listName) && !isDefaultList(listName)) {
    listName = listName+"Exclusive";
  }

  let csvContent = createCsvContent(sortIngredientListAsArray(lists[listName]), quickCompare);
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

/*
createCsvContent:
  Purpose: create the csv file array

  - Given a list and a quickCompare boolean
    - Push the csv header and list row into an array
    - If it's a quickCompare, no need for count
*/
function createCsvContent(list, quickCompare) {
  let lineArray = [];
  let header = quickCompare ? "Ingredient" : "Ingredient, #";

  lineArray.push(header);

  if (quickCompare) {
    list.forEach(function (infoArray) {
      lineArray.push(infoArray[1]);
    });
  } else {
    list.forEach(function (infoArray) {
      lineArray.push(infoArray.join(","));
    });
  }

  return lineArray.join("\n");
}
