/*
handleData:
  Purpose: top level function -- creates the various lists

  - Given a csvDataArray grabbed from a .csv
    - Instantiate the empty dataLists object
    - Call createSafeAllergicLists to fetch both the safeList and the allergicList
    - Set key and value in dataLists
    - Check that both the allergicList and safeList exists before creating exclusive lists
*/
function handleData(csvDataArray) {
  let promises = [];

  let sharedListPromise = createSharedList(csvDataArray).then(function (sharedList) {
    return new Promise(function (resolve) {
      resolve({"sharedList": sharedList});
    });
  })

  let safeAllergicListsPromise = createSafeAllergicLists(csvDataArray).then(function (safeAllergicLists) {
    let exclusiveLists = {};

    if (safeAllergicLists.allergicList && safeAllergicLists.safeList) {
       exclusiveLists = createExclusiveSafeAllergicLists(safeAllergicLists);
    }

    return new Promise( function (resolve) {
      resolve({safeAllergicLists, exclusiveLists});
    })
  });

  promises.push(sharedListPromise)
  promises.push(safeAllergicListsPromise);

  return promises;
}

/*
getRawData:
  Purpose: check if there's a website in the ingredients column instead of actual comma
  delimited ingredients and calls the appropriate web scraping functions

  - Given an ingredientsColumn
    - Check if it's a CosDna website
    - If yes, call getDomFromCosdna and return dom as a promise from Ajax
    - If not, return ingredients as is, wrapped in a promise
*/
function getRawData(ingredientsColumn) {
  if (isCosdna(ingredientsColumn)) {
    return getDomFromCosdna(ingredientsColumn);
  } else {
    return new Promise(function(resolve) {
      resolve(ingredientsColumn);
    });
  }
}

/*
getList:
  Purpose: helper method for the list fetching methods

  - Given a csvObject and a dictionary object
    - Call getRawData and pass in the 'Ingredients' column from the csv object
    - Call getIngredients on the data to get the actual ingredients from the rawData and return
      the data back as a dictionary, with ingredient as key and the count of the ingredient as the value
    - Return the dictionary as the final list
*/
function getList(csvObject, dict) {
  return getRawData(csvObject["Ingredients"]).then(function (data) {
    dict = iterateThroughDictionary(getIngredients(data), dict);
  }).catch(function(error){
    console.log("getList: " + error);
    console.log("getList csbObject: " + csvObject);
  })
}

/*
createExclusiveSafeAllergicLists:
  Purpose: to create lists that are exclusive from each other: e.g. safeListExclusive won't
  have any of the allergic ingredients on them and vice versa

  - Given an object of dataLists with allergicList and safeList
    - Make a deep copy of both lists and iterate through each list and delete what is not in the other
    - Repeat again for second list

  - ??: I wasn't able to move the for loops into separate methods to call -- would break some of the lists
*/
function createExclusiveSafeAllergicLists(dataLists) {
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

/*
createSharedList:
  Purpose: to created a shared list from the .csv object

  - Given a csvDataArray grabbed from a .csv
    - Creates an empty object instantiated as sharedList
    - Iterates through each row and passes the ingredients column to iterateThroughDictionary
      regardless of result
    - Sets it to sharedList
*/
function createSharedList (csvDataArray) {
  let sharedList = new Object();
  let promises = [];

  //includes TBD, good, && bad
  csvDataArray.forEach(function (csvObject) {
    promises.push(
      getList(csvObject, sharedList)
    );
  });

  return Promise.all(promises).then( () => {
    return sharedList;
  }).catch(function(error){
    console.log("createSharedList: " + error);
    console.log("createSharedList csvDataArray: " + csvDataArray);
  });

  return Promise.resolve(sharedList);
}

/*
createSafeAllergicLists:
  Purpose: to create safe and allergic lists from the .csv object

  - Given a csvDataArray grabbed from a .csv
      - Creates two empty objects instantiated as safeList and allergicList
      - Iterates through each row and lowercases the "result" key for comparison
      - If result is not "tbd", and is "safe", then pass ingredients iterateThroughDictionary
        and put all the ingredients into a safeList
      - If result is not "tbd", and is "bad" or "allergic", the pass ingredients
        iterateThroughDictionary and put all ingredients into an allergicList
*/
function createSafeAllergicLists(csvDataArray) {
  let safeList = new Object();
  let allergicList = new Object();
  let promises = [];

  csvDataArray.forEach(function (csvObject) {
    let result = csvObject["Result"].toString().toLowerCase();

    if (result !== "tbd") {
      if (goodWords.includes(result)) {
        promises.push(
          getList(csvObject, safeList)
        );
      } else if (badWords.includes(result)) {
        promises.push(
          getList(csvObject, allergicList)
        );
      } else {
        throw new Error();
      }
    }
  });

  return Promise.all(promises).then( () => {
    return {
      safeList: safeList,
      allergicList: allergicList
    };
  }).catch(function(error){
    console.log("createSafeAllergicLists: " + error);
    console.log("createSafeAllergicLists csvDataArray: " + csvDataArray);
  });
}

/*
iterateThroughDictionary:
  Purpose: to sanitize ingredients, lowercase them, and return the counts of each ingredient found

   - Given an ingredients column and a dictionary
      - Sanitizes the ingredients column using regex and removing zero width spaces
      - Loops through each ingredient, lowercases them, and replaces any ingredient
        that might just be "water" with simply water
      - Then puts the ingredient in a dictionary and increments the count for each time the ingredient is found
*/
function iterateThroughDictionary(ingredients, dict) {
  try {
    let ingredientsArray = sanitizeIngredientsInput(ingredients);

    ingredientsArray.forEach(function (listIngredient) {
      let ingredient = listIngredient.toLowerCase().trim();

      //replacing any aliases of water with just water
      if (waterList.includes(ingredient) || waterList.includes(ingredient.split(" ")[0])) {
        ingredient = "water";
      }

      dict[ingredient] = (dict[ingredient] || 0) + 1;
    });

  } catch (error) {
    console.log("iterateThroughDictionary: you may not have an 'Ingredients' column");
    console.log("iterateThroughDictionary: " + error);
  }

  return dict;
}

/*
sanitizeIngredientsInput:
  Purpose: helper method for iterateThroughDictionary to cleanup the sanitization of the input

  - Given an ingredients object
     - Verify if the ingredients object is an array or not -- if it's already an array,
       this means that the data was already grabbed and parsed from Cosdna
     - If the object is not an array, this data was from the .csv file -- replace any zero-width
       spaces with actual spaces
     - Regex this into an array and return
*/
function sanitizeIngredientsInput (ingredients) {
  //regex for splitting by just comma, while ignoring parens: /,(?![^(]*\))/
  //splits by a "space and comma" e.g. "foo, bar, xyz" vs "foo,bar,xyz", while ignoring parens
  let regex = /,(?![^(]*\)) /;
  let ingredientsArray = []

  if (Array.isArray(ingredients)) {
    ingredientsArray = ingredients;
  } else {
    //remove zero width space
    ingredients = ingredients.replace(/[\u200B-\u200D\uFEFF]/g, '');
    ingredientsArray = ingredients.split(regex).filter(Boolean);
  }

  return ingredientsArray;
}
