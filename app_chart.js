
var http = require('http');
var fs = require('fs');
var Mongolian = require('mongolian');

var address = "192.168.0.10";
var server = new Mongolian(address);
var collection = server.db("btcwatch").collection("record");



// get lasest data in 24 hours.
function getLasestData(callback) {
  collection.find().limit(1440).sort({ 'crawl_time': -1}).toArray(function (err, array) {
    if (!err) {
      callback(array);
    }
  });
}

http.createServer(function (req, res) {
  var url = req.url;

  if (url == '/index' || url == '/') {
    fs.readFile('./index.html', function(error, content) {
        if (error) {
            res.writeHead(500);
            res.end();
        }
        else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
  } else if (url == '/data') {
    getLasestData(function(array) {
      res.writeHead(200, {'Content-Type': 'application/json'});
      var d = JSON.stringify(array);
      //console.log(d);
      res.end(d + '\n');
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(1337, '0.0.0.0');
console.log('Server running at http://192.168.0.148:1337/');

