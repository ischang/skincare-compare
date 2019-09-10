/*
setDataAsTable
  Purpose: create the table divs and call the appropriate header and body functions

  - Given an ingredient list, list name, and countHeader boolean
    - Create the table divs and create the table header and table body
    - Set the table in the html
*/
function setDataAsTable(ingredientList, listName, countHeader) {
  let html = "<div class='table-responsive'>"
  html += "<table class='table table-hover' style='width:60%'>";

  html = setTableHeader(html, countHeader);
  html = setTableBody(html, ingredientList, countHeader);

  html += "</table>";
  html += "</div>";
  listName = "#" + listName + "Table";

  $(listName).html(html);
}

/*
setTableHeader:
  Purpose: set table header with html
*/
function setTableHeader(html, countHeader) {
  html+="<thead style='font-weight:bold;'>";
  html+="<tr>";
  html+="<th>Ingredient</th>";
  if (countHeader){
    html+="<th>#</th>";
  }
  html+="</tr>";
  html+="</thead>";

  return html;
}

/*
setTableBody:
  Purpose: set table body with html

  - Given html passed in, along with the minimized ingredients list and count header
    - Set the html and header
    - If it's a quick compare table, remove the count header
*/
function setTableBody(html, ingredientList, countHeader) {
  html += "<tbody>";
  let minList = returnMinTableList(ingredientList);

  for (let i = 0; i < minList.length; i++) {
    html += "<tr>";
    if (countHeader) {
      html += "<td>" + minList[i][0] + "</td>";
    }
    html += "<td>" + minList[i][1] + "</td>";
    html += "</tr>";
  }

  html += "</tbody>";

  return html;
}

/*
sortIngredientListArray:
  Purpose: sort ingredients by quantity and return

  - Given an ingredient list
    - Get the keys for the ingredient and value into an array
    - Sort and return
*/
function sortIngredientListAsArray(ingredientList) {
  let items = Object.keys(ingredientList).map(function(key) {
    return [key, ingredientList[key]];
  });

  items.sort(function (first, second) {
    return second[1] - first[1];
  });

  return items;
}

/*
returnMinListTable:
  Purpose: return either 10 or less ingredients from the list

  - Given a sorted ingredient list
    - Slice by 10 or less
*/
function returnMinTableList(ingredientList) {
  let items = sortIngredientListAsArray(ingredientList);
  return items.slice(0, setMinTableLength(ingredientList.length));
}

/*
setMinTableLength:
  Purpose: find the minimum length the table needs to be

  - Given length of sorted ingredients list
    - Determine if the length should be 10, or the exact length of the list (less than 10)
*/
function setMinTableLength(listLength) {
  return listLength < 10 ? listLength : 10;
}
