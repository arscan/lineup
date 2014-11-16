#!/usr/bin/env nodejs

/* run from base dir */

var http = require('http'),
    fs = require('fs');

var options = {
  host: 'api.flickr.com',
  path: '/services/feeds/photos_public.gne?format=json&id=45001949@N00&jsoncallback=FLICKR.setItems'
};

var callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    
      fs.writeFile("js/FlickrImages.js", '/* created by bin/downloadflickr.js */\n\n' + str, function(error){
          if(error){
              console.log("ERROR: " + error); }
          var resObj = JSON.parse(str.substring(16, str.length-1));
          // console.log(resObj.items);

          for(var i = 0; i<resObj.items.length; i++){
              downloadAndSaveImage(resObj.items[i].media.m, function(error){
                  if(error !== null){
                      console.log("ERROR: " + error);
                  } else {
                      console.log("Saved!");
                  }
              });
          }
      });
    
  });
}

function splitURL(url){
    var host = url.split("/")[2];
    var path = url.substring(url.indexOf(host) + host.length);

    return {
        host: host,
        path: path
    };
}

function downloadAndSaveImage(url, cb){
    console.log('saving ' + url);

    var imageOptions = splitURL(url);

    var imageCallback = function(res){
        res.setEncoding('binary');

        var data = '';
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end', function() {
            fs.writeFile("images/flickr/" + imageOptions.path.split("/")[imageOptions.path.split("/").length -1], data, 'binary', cb);
        });
        res.on('error', cb);
    };

    http.request(imageOptions, imageCallback).end();
}



http.request(options,callback).end();
