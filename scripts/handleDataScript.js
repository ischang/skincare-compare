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
quickCompare:

  Purpose: for the Quick Compare tool. Given two columns, whether comma delimited ingredients or a CosDna webpage,
  compare and give both the shared ingredients and the not-shared ingredients

  - Given two ingredients columns (strings)
    - Call getIngredients on both strings
    - Merge both and pass that into createSharedList and set that as one list
    - Create a new list called nonSharedList and run the same logic as
      createExclusiveSafeAllergicLists (possibly refactor)
    - Return both lists
*/
function quickCompare (columnA, columnB) {
  return getIngredients(columnA).then(function(dataA){
    dataA = parseIngredients(dataA)
    return getIngredients(columnB).then(function(dataB){
      dataB = parseIngredients(dataB);
      let quickCompareList = dataA.filter(object => dataB.includes(object));

      let exclusiveListA = dataA.filter(function (object) {
        return dataB.indexOf(object) == -1;
      });

      let exclusiveListB = dataB.filter(function (object) {
        return dataA.indexOf(object) == -1;
      });

      return new Promise(function (resolve){
        resolve({quickCompareList, exclusiveListA, exclusiveListB})
      })
    }).catch(function(error){
      console.log(error);
    })
  });
}

function callQuickCompareTest () {
  quickCompare("http://www.cosdna.com/eng/cosmetic_df52126587.html", "http://www.cosdna.com/eng/cosmetic_b890343471.html").then(function (data) {
    console.log(data);
  })
}

/*
getIngredients:
  Purpose: check if there's a website in the ingredients column instead of actual comma
  delimited ingredients and calls the appropriate web scraping functions

  - Given an ingredientsColumn
    - Check if it's a CosDna website
    - If yes, call fetchIngredientsFromCosdna and return ingredients
    - If not, return ingredients as is
*/
function getIngredients (ingredientsColumn) {
  if (isCosdna(ingredientsColumn)) {
    return getDomFromCosdna(ingredientsColumn);
  } else {
    return new Promise(function(resolve) {
      console.log(ingredientsColumn);
      resolve(ingredientsColumn);
    });
  }
}

function getIngredientsPromise (csvObject, dict) {
  return getIngredients(csvObject["Ingredients"]).then(function (data) {
    dict = iterateThroughDictionary(parseIngredients(data), dict);
  }).catch(function(error){
    console.log(error);
  })
}

/*
createExclusiveSafeAllergicLists:
  Purpose: to create lists that are exclusive from each other: e.g. safeListExclusive won't
  have any of the allergic ingredients on them and vice versa

  - Given an object of dataLists with allergicList and safeList
    - Make a deep copy of both lists and iterate through each list and delete what is not in the other
    - Repeat again for second list
*/
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
  // try{
  csvDataArray.forEach(function (csvObject) {
    promises.push(
      getIngredientsPromise(csvObject, sharedList)
    );
  });

  return Promise.all(promises).then( () => {
    return sharedList;
  }).catch(function(error){
    console.log(error);
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
          getIngredientsPromise(csvObject, safeList)
        );
      } else if (badWords.includes(result)) {
        promises.push(
          getIngredientsPromise(csvObject, allergicList)
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
    console.log(error);
  });
}

/*
iterateThroughDictionary:

 Purpose: to sanitize ingredients, lowercase them, and return the counts of each ingredient found

 - Given an ingredients column and a dictionary
    - Sanitizes the ingredients column using regex and removing zero width spaces
    - Loops through each ingredient, lowercases them, and replaces any ingredient that might just be "water" with simply water
    - Then puts the ingredient in a dictionary and increments the count for each time the ingredient is found
*/
function iterateThroughDictionary(ingredients, dict) {
  try {
    let ingredientsArray = sanitizingIngredientsInput(ingredients);

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

function sanitizingIngredientsInput (ingredients) {
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
