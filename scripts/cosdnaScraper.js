/*
cosdnaScrape:
  Purpose: scrape from Cosdna and return comma separated values

  - Get link, scrape, and return list and join by space and comma
*/

function cosdnaScrapeMain() {
  let cosdnaLink = document.getElementById('cosdnaInput').value;

  if(jQuery.isEmptyObject(cosdnaLink)) {
    window.alert("You didn't input a link!")
    console.log("cosdnaScrape: user didn't input a link");
  }

  cosdnaScrape(cosdnaLink).then(function(result) {
    let finalList = result;

    if (document.getElementById("spaceRadio").checked) {
      finalList = result.join(", ");
    }

    document.getElementById("scrapedResult").value = finalList;
  })
}

function cosdnaScrape(cosdnaLink) {
  return getRawData(cosdnaLink).then(function (result) {
    result = getIngredients(result);

    return new Promise(function (resolve) {
      resolve(result);
    })

    }).catch(function (error) {
      console.log("cosdnaScrape: " + error);
      console.log("cosdnaScrape cosdnaLink: " + cosdnaLink);
    });
}
