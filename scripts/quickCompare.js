/*
quickCompare:
  Purpose: for the Quick Compare tool. Given two columns, whether comma delimited ingredients or a CosDna webpage,
  compare and give both the shared ingredients and the not-shared ingredients

  - Given two ingredients columns (strings)
    - Call getRawData on both strings to get two different lists - dataA and dataB
    - Create a list of what both the column ingredients share
    - Merge two lists and run a filter to exclude what's in the sharedList to get an exclusiveList
    - Return both lists
*/

function quickCompareMain() {
  console.log("hi");
  let dataA = document.getElementById('textDataA').value;
  let dataB = document.getElementById('textDataB').value;

  quickCompare(dataA, dataB).then(function(quickCompareLists){
    lists["quickCompareSharedList"] = quickCompareLists.quickCompareSharedList;
    lists["quickCompareUniqueList"] = quickCompareLists.quickCompareUniqueList;

    setDataAsTable(quickCompareLists.quickCompareSharedList, "quickCompareSharedList", false);
    setDataAsTable(quickCompareLists.quickCompareUniqueList, "quickCompareUniqueList", false);
  })
}

function quickCompare(columnA, columnB) {
  return getRawData(columnA).then(function(dataA){
    dataA = Object.keys(iterateThroughDictionary(getIngredients(dataA), {}))
    return getRawData(columnB).then(function(dataB){
      dataB = Object.keys(iterateThroughDictionary(getIngredients(dataB), {}));

      let quickCompareSharedList = dataA
          .filter(object => dataB.includes(object));
      let mergedList = dataA.concat(dataB);
      let quickCompareUniqueList = mergedList
          .filter(object => quickCompareSharedList.indexOf(object) === -1);

      return new Promise(function (resolve){
        resolve({quickCompareSharedList, quickCompareUniqueList});
      })
    }).catch(function(error){
      console.log(error);
    })
  });
}
