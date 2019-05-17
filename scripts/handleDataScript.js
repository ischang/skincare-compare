function handleData(csvDataArray) {
  let dataLists = {};
  let safeAllergicLists = createSafeAllergicLists(csvDataArray);

  dataLists["sharedList"] = createSharedList(csvDataArray);
  dataLists["allergicList"] = safeAllergicLists.allergicList;
  dataLists["safeList"] = safeAllergicLists.safeList;

  if (dataLists.allergicList && dataLists.safeList) {
    let exclusiveLists = createExclusiveSafeAllergicLists(dataLists);
    dataLists["safeListExclusive"] =  exclusiveLists.safeListExclusive;
    dataLists["allergicListExclusive"] = exclusiveLists.allergicListExclusive;
  }

  return dataLists;
}

function createExclusiveSafeAllergicLists (dataLists) {
  let allergicListExclusive = jQuery.extend(true, {}, dataLists.allergicList);
  let safeListExclusive = jQuery.extend(true, {}, dataLists.safeList);

  for (let key in dataLists.allergicList) {
    if (key in dataLists.safeList) {
      delete allergicListExclusive[key];
    }
  }

  for (let key in dataLists.safeList) {
    if (key in dataLists.allergicList) {
      delete safeListExclusive[key];
    }
  }

  return {
    safeListExclusive: safeListExclusive,
    allergicListExclusive: allergicListExclusive
  }
}

function createSharedList (csvDataArray) {
  let sharedList = new Object();

  //includes TBD, good, && bad
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

    //regex for splitting by just comma, while ignoring parens: /,(?![^(]*\))/
    //splits by a "space and comma" e.g. "foo, bar, xyz" vs "foo,bar,xyz", while ignoring parens
    let regex = /,(?![^(]*\)) /;

    //remove zero width space
    ingredients = ingredients.replace(/[\u200B-\u200D\uFEFF]/g, '');
    let ingredientsArray = ingredients.split(regex).filter(Boolean);

    ingredientsArray.forEach(function (listIngredient) {
      let ingredient = listIngredient.toLowerCase().trim();

      //replacing any aliases of water with just water
      if (waterList.includes(ingredient) || waterList.includes(ingredient.split(" ")[0])) {
        ingredient = "water";
      }

      dict[ingredient] = (dict[ingredient] || 0) + 1;
    });

  } catch (error) {
    console.log(error)
    //will do this twice unless i do this check outside
    errors.push("You do not have an \'Ingredients\' column")
  }

  return dict;
}
