function handleData(csvDataArray) {
  let dataLists = {};
  let safeAllergicLists = createSafeAllergicLists(csvDataArray);

  dataLists["sharedList"] = createSharedList(csvDataArray);
  dataLists["allergicList"] = safeAllergicLists.allergicList;
  dataLists["safeList"] = safeAllergicLists.safeList;

  if (dataLists.allergicList && dataLists.safeList) {
    let excluseLists = createExclusiveSafeAllergicLists(dataLists);
    dataLists["safeListWithoutAllergic"] =  excluseLists.safeListWithoutAllergic;
    dataLists["allergicListWithoutSafe"] = excluseLists.allergicListWithoutSafe;
  }

  return dataLists;
}

function createExclusiveSafeAllergicLists (dataLists) {
  let allergicListWithoutSafe = dataLists.allergicList;
  let safeListWithoutAllergic = dataLists.safeList;

  for (let key in lists.allergicList) {
    if (key in lists.safeList) {
      delete allergicListWithoutSafe[key];
    }
  }

  for (let key in lists.safeList) {
    if (key in lists.allergicList) {
      delete safeListWithoutAllergic[key];
    }
  }

  return {
    safeListWithoutAllergic: safeListWithoutAllergic,
    allergicListWithoutSafe: allergicListWithoutSafe
  }
}

function createSharedList (csvDataArray) {
  let sharedList = new Object();

  try {
    csvDataArray.forEach(function (csvObject) {
      sharedList = iterateThroughDictionary(csvObject["Ingredients"], sharedList);
    })
  } catch (error) {
    console.log(error);
    errors.push("You might have a) misspelled your column");
  }

  return sharedList;
}

function createSafeAllergicLists(csvDataArray) {
  let safeList = new Object();
  let allergicList = new Object();

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

  return {
    safeList: safeList,
    allergicList: allergicList
  };

}

function iterateThroughDictionary(ingredients, dict) {
  try {
    //splits by comma, space, and removes empty string
    let ingredientsArray = ingredients.split(/[,]+/).filter(Boolean);

   ///^[ A-Za-z0-9_@./#&+-]*$/
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
