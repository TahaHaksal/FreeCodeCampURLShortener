require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const url_database = [];

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const url_regex = /^(http|https):\/\/[^ "]+$/;
  if (!url || !url_regex.test(url)){
    res.json({
      error: "Invalid URL"
    })
    return ;
  }
  if (!url_database.includes(url)){
    url_database.push(url);
  }
  console.log(url_database)
  res.json({
    original_url: url,
    short_url: url_database.indexOf(url)
  });
});

app.get('/api/shorturl/:id', function(req, res) {
  if (!url_database[req.params.id]){
    res.json({
      error: "No short URL found for the given input"
    })
  } else {
    res.redirect(url_database[req.params.id]);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
