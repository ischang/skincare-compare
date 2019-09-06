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
  let dataLists = {};
  // let safeAllergicLists = createSafeAllergicLists(csvDataArray);
  // return createSharedList(csvDataArray).then(function (data){
  //   console.log(data);
  //   dataLists["sharedList"] = data;
  //   return Promise.resolve(dataLists);
  // }).catch(function (error){
  //   console.log(error);
  // });

  return createSharedList(csvDataArray).then(function (data) {
    console.log(data);
    dataLists["sharedList"] = data;
    console.log(dataLists["sharedList"]);

    return new Promise(function (resolve) {
      resolve(dataLists);
    });
  });

  // dataLists["sharedList"] = createSharedList(csvDataArray);
  // dataLists["allergicList"] = safeAllergicLists.allergicList;
  // dataLists["safeList"] = safeAllergicLists.safeList;
  //
  //
  // if (dataLists.allergicList && dataLists.safeList) {
  //   let exclusiveLists = createExclusiveSafeAllergicLists(dataLists);
  //   dataLists["safeListExclusive"] =  exclusiveLists.safeListExclusive;
  //   dataLists["allergicListExclusive"] = exclusiveLists.allergicListExclusive;
  // }


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
function quickCompare () {
  // here are the ingredients these two columns share:
  // here are the ingredients these two columns do not share
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
  //this should be called before iterateThroughDictionary and is what is passed into iterateThroughDictionary
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
  //
  // return new Promise(function (resolve, reject) {
  //   try {
  //     csvDataArray.forEach(function (csvObject) {
  //       getIngredients(csvObject["Ingredients"]).then(function (data) {
  //         sharedList = iterateThroughDictionary(parseIngredients(data), sharedList);
  //       });
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     console.log("world");
  //     reject("problem in createSharedList")
  //   }
  // });

  //includes TBD, good, && bad
  // try{
  csvDataArray.forEach(function (csvObject) {
    // console.log(getIngredients(csvObject["Ingredients"]).then(function (data) {
    //   sharedList = iterateThroughDictionary(parseIngredients(data), sharedList);
    // }));
    promises.push(
      getIngredients(csvObject["Ingredients"]).then(function (data) {
        sharedList = iterateThroughDictionary(parseIngredients(data), sharedList);
      }).catch(function(error){
        console.log(error);
      })
    )
  });

  return Promise.all(promises).then( () => {
    return sharedList;
  }).catch(function(error){
    console.log(error);
  });

  return Promise.resolve(sharedList);
  // csvDataArray.forEach(function (csvObject) {
  //   getIngredients(csvObject["Ingredients"]).then(function (data) {
  //     sharedList = iterateThroughDictionary(parseIngredients(data), sharedList);
  //   });
  // })
  // } catch (error) {
  //   console.log(error);
  //   errors.push("You might have a) misspelled your column");
  // }
}

function createSafeAllergicLists(csvDataArray) {
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
