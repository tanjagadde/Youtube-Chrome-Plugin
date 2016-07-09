// After the API loads, call a function to enable the search box.

function handleAPILoaded() {
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  $('#publishAfter-from').val(oneWeekAgo.toString().substring(0, 15));
  $('#publishBefore-to').val((new Date()).toString().substring(0, 15));
  $('#search-button').attr('disabled', false);
  
}

$(document).ready(function() {
    $("#search-button").on("click", function() {
      search();
    });
  });


function search() {
console.log('click search')
$('#search-container').remove();
$("#outer-search").append("<div id=search-container></div>")
  var request = gapi.client.youtube.subscriptions.list({
    mine: true,
    maxResults: 50,
    part: 'snippet'
  });

  function ISODateString(d) {
    function pad(n) {
      return n < 10 ? '0' + n : n
    }
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z'
  }

  request.execute(function(response) {

    var str = JSON.stringify(response.result.items);
    //var channels =[];

    function ISODateString(d) {
      function pad(n) {
        return n < 10 ? '0' + n : n
      }
      return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z'
    }

    function loadIframe(iframeName, url) {
      var $iframe = $('#' + iframeName);
      if ($iframe.length) {
        $iframe.attr('src', url);
        return false;
      }
      return true;
    }
    var q = $('#publishAfter-from').val();
    var p = $('#publishBefore-to').val();

    for (i = 0; i < response.result.items.length; i++) {
    
      var requestSearch = gapi.client.youtube.search.list({
        channelId: response.result.items[i].snippet.resourceId.channelId,
        order: 'date',
        part: 'snippet',
        maxResults: 15,
        publishedAfter: ISODateString(new Date(q)),
        publishedBefore: ISODateString(new Date(p))
      });
      requestSearch.execute(function(response) {
        var str = JSON.stringify(response.result);
        var list = [];
        list.push('<ul>');
        for (i = 0; i < response.result.items.length; i++) {
          
          list.push('<li><h3>' +' Subscribed Channel: ' + response.result.items[i].snippet.title +'<br> '+ response.result.items[i].snippet.publishedAt + ' </h3><iframe src=http://www.youtube.com/embed/' + response.result.items[i].id.videoId + ' width="220" height="245"></iframe></li>');
        }
        list.push('</ul>');
       
        $('#search-container').append(list.join(''));
        while (list.length > 0) {
          list.pop();
        }
      });
    }
    
  });

}