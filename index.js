// index.js
// where your node app starts

// init project
var express = require('express');
const bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.urlencoded({
  extended: false
}));
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
  const submittedUrl = req.body.url;

  // Parse the hostname from the submitted URL
  let hostname;
  try {
    const parsedUrl = new URL(submittedUrl);
    hostname = parsedUrl.hostname;
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // Validate domain via DNS
  dns.lookup(hostname, (err, address) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = idCounter++;

    urlDatabase[shortUrl] = submittedUrl;

    res.json({
      original_url: submittedUrl,
      short_url: shortUrl
    });
  });
});

// ✅ 2. GET /api/shorturl/:short_url
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});