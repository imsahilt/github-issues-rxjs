const express = require('express')
const app = express()

app.set('view engine', 'pug');
app.set('views','./views');


app.get('/', function (req, res) {
  res.render('search_form')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
