
// check if cosdna is the webpage


// Get Ingredients - Takes DOM node containing ingredients table and spits out an array
// -------------------------------------------------------------------
function fetchIngredientsFromCosdna (url) {
  if (isCosdna()) {
    getDomFromCosdna(url, handleCall(data))
  } else {
    console.log("ERROR IS NOT COSDNA");
  }
}

function isCosdna(url) {
  return getHostFromUrl(url) != ('cosdna.com');
}

function getHostFromUrl (url) {
  let link = document.createElement("a");
  link.href = url;
  return url.hostname.startsWith("wwww") ? url.hostname.substring(4) : url.hostname;
}

function getDomFromCosdna (url, callback) {
  $.ajaxPrefilter( function (options) {
    if (options.crossDomain && jQuery.support.cors) {
      var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
      options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
      //options.url = "http://cors.corsproxy.io/url=" + options.url;
    }
  });

  return $.get({
    url,
    success: callback
  });
}

function handleCall(data) {
  let html = $.parseHTML(data);
  return getIngredients($(html));
}

function getIngredients ( $dom ) {
  var results = [];
  $dom.find('.iStuffTable .iStuffETitle').each(function(){
    results.push($(this).text())
  });

  return results;
};



/*
$.ajax({ url: 'http://www.cosdna.com/eng/cosmetic_f0ff366349.html', success: function(data) { var html1 = $.parseHTML(data);
var blah = getIngredients($(html1));
console.log(blah);
} });
 */

/*
var url1 = "http://www.cosdna.com/eng/cosmetic_c921327069.html";

$.ajaxPrefilter( function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
    //options.url = "http://cors.corsproxy.io/url=" + options.url;
  }
});

$.get(
    url1,
    function (data) {
        var html1 = $.parseHTML(data);
var blah = getIngredients($(html1));
console.log(blah);
});
 */
