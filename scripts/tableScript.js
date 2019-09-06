function setDataAsTable(ingredientList, listName) {
  let html = "<div class='table-responsive'>"
  html += "<table class='table table-hover' style='width:60%'>";

  html = setTableHeader(html);
  console.log(ingredientList);
  html = setTableBody(html, ingredientList);
  console.log(html);

  html += "</table>";
  html += "</div>";
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
  console.log(ingredientList);
  console.log(minList);

  for (var i = 0; i < minList.length; i++) {
    html += "<tr>";
    html += "<td>" + minList[i][0] + "</td>";
    html += "<td>" + minList[i][1] + "</td>";
    html += "</tr>";
  }

  html += "</tbody>";

  return html;
}

function sortIngredientListAsArray(ingredientList) {

  // let items = ["sos", "wow"];

  // let items = [];
  console.log(ingredientList);
  let items = Object.keys(ingredientList).map(function(key) {
    return [key, ingredientList[key]];
  });

  items.sort(function (first, second) {
    return second[1] - first[1];
  });

  return items;
}

function returnMinTableList(ingredientList) {
  let items = sortIngredientListAsArray(ingredientList);
  return items.slice(0, setMinTableLength(ingredientList.length));
  // return items.slice(0, setMinTableLength(4));
}

function setMinTableLength(listLength) {
  return listLength < 10 ? listLength : 10;
}
