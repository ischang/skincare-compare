var waterList = ["aqua", "eau", "water", "h20"];
var goodWords = ["safe", "good", "yes"];
var badWords = ["allergic", "bad", "no"];
var errors = [];

function setFileNameOnUpload(file) {
  $('#uploadFileInfo').val(file.files[0].name)
}

$(document).ready(function() {
  //TODO: remove alerts after testing is done

  // The event listener for the file upload
  document.getElementById('csvFileUpload').addEventListener('input', uploadCsvFile, false);


  // Method that checks that the browser supports the HTML5 File API
  function doesBrowserSupportFileUpload() {
    return window.File && window.FileReader && window.FileList && window.Blob;
  }

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
          let lists = handleData(data);
          for (let key in lists.safeList) {
            console.log(key);
            console.log(lists.safeList[key]);
          }
          console.log(handleData(data));

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

  function setDataAsTable(ingredientList, listName) {
    var html = "<div class='table-responsive'>";
    html+= "<table class='table' style='width:60%'>";

    html = setTableHeader(html);
    html = setTableBody(html, ingredientList);

    html+= "</table>";
    html+= "</div>";

    listName = "." + listName + "Table";

    $(listName).html(html);
  }

  function setTableBody(html, ingredientList) {
    html += "<tbody>";
    var minList = sortMinListAsArray(ingredientList);

    for (var i = 0; i < minList.length; i++) {
      html+= "<tr>";
      html+= "<td>" + minList[i][0] + "</td>";
      html+= "<td>" + minList[i][1] + "</td>";
      html+= "</tr>";
    }

    html+= "</tbody>";

    console.log(html);

    return html;
  }

  function sortMinListAsArray(ingredientList) {
    var items = Object.keys(ingredientList).map(function(key) {
      return [key, ingredientList[key]];
    });

    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    return items.slice(0, setMinTableLength(ingredientList.length));
  }

  function setMinTableLength(listLength) {
    return listLength < 10 ? listLength : 10;
  }

  function setTableHeader(html) {
    html+="<thead>";
    html+="<tr>";
    html+="<th>Ingredient</th>";
    html+="<th>#</th>";
    html+="</tr>";
    html+="</thead>";

    return html;
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
