
// check if cosdna is the webpage


// Get Ingredients - Takes DOM node containing ingredients table and spits out an array
// -------------------------------------------------------------------
// function fetchIngredientsFromCosdna (url) {
//   if (isCosdna()) {
//     getDomFromCosdna(url, handleCall(data))
//   } else {
//     console.log("ERROR IS NOT COSDNA");
//   }
// }

function isCosdna(url) {
  return getHostFromUrl(url) == ('cosdna.com');
}

/*
addHttp:
  Purpose: check if string needs 'http://' prepended to it. We need to add the 'http://'
  in order to grab the hostname from an anchor element. Even if this isn't a valid url,
  we don't particularly care since we're just checking if the hostname matches with cosdna.com.
  I think this was the simplest way to go about it without using a crap ton of Regex

  - Given a string
    - If string doesn't have an http:// in front of it, add http:// and return
*/
function addHttp(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url;
  }
  return url;
}

/*
getHostFromUrl:
  Purpose: grab hostname from an anchor element to check if it's a valid url

*/
function getHostFromUrl (url) {
  let link = document.createElement("a");
  link.href = addHttp(url);

  if (link.hostname.startsWith("www")) {
    return link.hostname.substring(4);
  }

  return link.hostname;
}


function getDomFromCosdna (url) {
  $.ajaxPrefilter( function (options) {
    if (options.crossDomain && jQuery.support.cors) {
      var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
      options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
      //options.url = "http://cors.corsproxy.io/url=" + options.url;
    }
  });

  return new Promise(function (resolve, reject) {
    $.get({
      url,
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        reject(error)
      }
    })
  });
}

function parseIngredients (data) {
  let html = $.parseHTML(data);
  var results = [];
  $(html).find('.iStuffTable .iStuffETitle').each(function(){
    results.push($(this).text())
  });

  if (results.length === 0) {
    results = data;
  }

  return results;
};
