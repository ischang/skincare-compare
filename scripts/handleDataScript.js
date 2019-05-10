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
    let ingredientsArray = ingredients.split(/[,]+/).filter(Boolean);

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
