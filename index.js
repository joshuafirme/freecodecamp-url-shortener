// index.js
// where your node app starts

// init project
var express = require('express');
const bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({
  optionsSuccessStatus: 200
})); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

let urls = []; // In-memory URL storage

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  // Simple regex check for valid URL
  const urlRegex = /^https?\:\/\/([a-zA-Z0-9]+\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+\/?[\w\/\-\.\_\~\!\$\&\'\(\)\*\+\,\;\=\:\@\%]+?$/

  if (!urlRegex.test(url)) {
    return res.json({
      error: 'invalid url'
    });
  }

  // Check if URL already exists
  const existing = urls.find(entry => entry.original_url === url);
  if (existing) {
    return res.json(existing);
  }

  const shortUrl = urls.length + 1;
  const entry = {
    original_url: url,
    short_url: shortUrl
  };
  urls.push(entry);

  res.json(entry);
});

// Step 3: Redirect using short_url
app.get('/api/shorturl/:short', (req, res) => {
  const short = parseInt(req.params.short);
  const entry = urls.find(item => item.short_url === short);

  if (entry) {
    return res.redirect(entry.original_url);
  } else {
    return res.status(404).json({
      error: 'No short URL found for the given input'
    });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});