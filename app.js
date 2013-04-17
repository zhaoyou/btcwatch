
var http = require('http');
var fs = require('fs');
var Mongolian = require('mongolian');

var address = "127.0.0.1";
var server = new Mongolian(address);
var collection = server.db("btcwatch").collection("record");

var BTC_CHINA_URL = 'www.btcwatch.com';
var BTC_PATH = "/price/api"


setInterval(function() {
    //var options = {
    //  hostname: BTC_CHINA_URL,
    //  port: 80,
    //  path: BTC_PATH,
    //  method: 'GET'
    //};

    //var req = http.request(options, function(res) {
    //  res.setEncoding('utf8');
    //  var data = "";
    //  res.on('data', function (chunk) {
    //    data += chunk;
    //  });

    //  res.on('end', function() {
    //    var obj = JSON.parse(data);
    //    obj['_id'] = obj['update_time'];
    //    obj['crawl_time'] = new Date().getTime();
    //    collection.save(obj);
    //  });
    //});

    //req.on('error', function(e) {
    //  console.log('problem with request: ' + e.message);
    //});

    //req.end();
    console.log('request btcchina get status...');
}, 60000);

function getLasestData(callback) {
  collection.find().limit(1440).sort({ 'crawl_time': -1}).toArray(function (err, array) {
      // do something with the array
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

