function setDataAsTable(ingredientList, listName) {
  var html = "<div class='table-responsive'>"
  html += "<table class='table table-hover' style='width:60%'>";

  html = setTableHeader(html);
  html = setTableBody(html, ingredientList);

  html+= "</table>";
  html+="</div>";
  console.log(html);
  listName = "#" + listName + "Table";

  $(listName).html(html);
}

function setTableHeader(html) {
  html+="<thead style='font-weight:bold;'>";
  html+="<tr>";
  html+="<th>Ingredient</th>";
  html+="<th>#</th>";
  html+="</tr>";
  html+="</thead>";

  return html;
}

function setTableBody(html, ingredientList) {
  html += "<tbody>";
  let minList = returnMinTableList(ingredientList);

  for (var i = 0; i < minList.length; i++) {
    html+= "<tr>";
    html+= "<td>" + minList[i][0] + "</td>";
    html+= "<td>" + minList[i][1] + "</td>";
    html+= "</tr>";
  }

  html+= "</tbody>";

  return html;
}

function sortIngredientListAsArray(ingredientList) {
  let items = Object.keys(ingredientList).map(function(key) {
    return [key, ingredientList[key]];
  });

  items.sort(function(first, second) {
    return second[1] - first[1];
  });

  return items;
}


function returnMinTableList(ingredientList) {
  let items = sortIngredientListAsArray(ingredientList);

  return items.slice(0, setMinTableLength(ingredientList.length));
}

function setMinTableLength(listLength) {
  return listLength < 10 ? listLength : 10;
}
