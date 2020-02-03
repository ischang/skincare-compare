
/*
isCosdna:
  Purpose: check if the url given matches the cosdna hostname

  - Given a string, check if the url matches 'cosdna.com' and return a boolean
*/
function isCosdna(url) {
  return getHostFromUrl(url) == ('cosdna.com');
}

/*
addHttp:
  Purpose: check if string needs 'http://' prepended to it. We need to add the 'http://'
  in order to grab the hostname from an anchor element.

  Notes: Even if this isn't a valid url, the 'http://' protocol added to it will
         make it so the anchor element does think it's a valid URL. However, we don't
         particularly care since we're just checking if the hostname matches with cosdna.com.
         There were more Regexy ways to go about this, but I think this was the simplest way
         to go about it for our purposes without adding additional Regex, making it hard to debug.

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

  - Given a string, create an anchor element
    - Call the addHttp method to add protocol in front of URL if it does not exist,
      otherwise it won't be considered a valid URL by the anchor element
    - If the hostname starts with 'www', strip it, otherwise return the hostname

  - ??: ternary operator didn't work here for some reason
*/
function getHostFromUrl (url) {
  let link = document.createElement("a");
  link.href = addHttp(url);

  if (link.hostname.startsWith("www")) {
    return link.hostname.substring(4);
  }

  return link.hostname;
}

/*
getDomFromCosdna:
  Purpose: grab the HTML dom from any Cosdna webpage

  Notes: In case CORS stops working suddenly, this code was pulled from
          https://stackoverflow.com/questions/15005500/loading-cross-domain-endpoint-with-jquery-ajax

  - Given a url, run the ajaxPrefilter code to add options and add the URL through the CORS-anywhere API
  through Heroku
    - return a new Promise wrapping the $.ajax.get method that returns the dom
*/
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

/*
getIngredients:
  Purpose: return ingredients either from DOM or from csv

  - Given data, either a DOM or a string of comma delimited values
    - If data can be parsed by HTML (meaning it's a DOM),
      find the Cosdna table to push each result into an array
    - If data is not a DOM, it's a string of comma delimited values --
      set results as data and return
*/
function getIngredients (data) {
  let html = $.parseHTML(data);
  let results = [];
  $(html).find('.tr-i .colors').each(function(){
    results.push($(this).text())
  });

  if (results.length === 0) {
    results = data;
  }

  return results;
};
