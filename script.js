var waterList = ["aqua", "eau", "water", "h20"];
var goodWords = ["safe", "good", "yes"];
var badWords = ["allergic", "bad", "no"];
var errors = [];

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
      alert('Your browser/browser version is not compatible with the File API. Please refer to https://caniuse.com/#feat=filereader');
    } else {
      var data = null;
      var reader = new FileReader();
      reader.readAsText(event.target.files[0]);

      reader.onload = function (csvData) {
        data = $.csv.toObjects(csvData.target.result);

        if (data && data.length > 0) {
          console.log(handleData(data));
          if (errors.length > 0) {
            alert(errors);
          }
          alert('Imported -' + data.length + '- rows successfully!');
        } else {
          alert('No data to import!');
        }
      };

      reader.onerror = function () {
        alert('Unable to read ' + file.fileName);
      };
    }
  }

  function handleData(csvDataArray) {
    var safeList = new Object();
    var allergicList = new Object();

    try {
      csvDataArray.forEach(function (csvObject) {
        let result = csvObject["Result"].toString().toLowerCase();

        if (result !== "tbd") {
          if (goodWords.includes(result)) {
            safeList = iterateThroughDictionary(csvObject["Ingredients"], safeList);
          } else if (badWords.includes(result)) {
            allergicList = iterateThroughDictionary(csvObject["Ingredients"], allergicList);
          } else {
            throw new Error();
          }
        }
      });
    } catch (error) {
      console.log(error);
      errors.push("You a) might not have a \'Result\' column, b) misspelled your column, or c) one of your results is empty: please fill in \'safe\', \'good'\, \'yes\', \'no'\, \'bad\', \'allergic\', or \'tbd\'");
    }

    //option 2
    for(let key in allergicList) {
      if (key in safeList) {
        delete allergicList[key];
      }
    }

    //option 3
    //just iterate through + add

    return {
      safeList: safeList,
      allergicList: allergicList
    };
  }

  function iterateThroughDictionary(ingredients, dict) {
    try {
      //splits by comma, space, and removes empty string
      let ingredientsArray = ingredients.split(/[ ,]+/).filter(Boolean);

      ingredientsArray.forEach(function (listIngredient) {
        var ingredient = listIngredient.toLowerCase();

        if (waterList.includes(ingredient)) {
          ingredient = "water";
        }

        dict[ingredient] = dict[ingredient] ? dict[ingredient]+1 : 1;
      });
    } catch (error) {
      console.log(error)
      //will do this twice unless i do this check outside
      errors.push("You do not have an \'Ingredients\' column")
    }

    return dict;
  }
})