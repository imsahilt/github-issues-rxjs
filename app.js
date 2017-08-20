const express = require('express')
const app = express()
const REDIS_PORT = 6379;
const redis = require('redis');
const client = redis.createClient(REDIS_PORT);

app.set('view engine', 'pug');
app.set('views','./views');


app.get('/', function (req, res) {
  res.render('search_form')
})

app.get('/repo/:author/:repo/get-issues/:page', function (req, res) {
    cache_key = req.params.author + ":" + req.params.repo + ":" + req.params.page
    var cache_found;
    client.get(cache_key,function (error, entry) {
      if ( error ){
        console.log("key: "+ cache_key +" error occured.");
      }
      //handle json parse execptions.
      if(entry){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.parse(entry));
        console.log("key: "+ cache_key +" found and served from cache..")
        return true;
      }else{
        var request = require('request');
        var options = {
            url: 'https://api.github.com/repos/' + req.params.author+ '/'+ req.params.repo+ '/issues?page='+ req.params.page,
            headers: {
                'User-Agent': 'request'
                }
            };
        request(options, function (error, response, body) {
            //handle status code.
            client.set(cache_key, JSON.stringify(body));
            console.log("key: "+ cache_key +"added to cache cache..")
            res.setHeader('Content-Type', 'application/json');
            res.send(body);
        })
        return false;
      }
    });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})