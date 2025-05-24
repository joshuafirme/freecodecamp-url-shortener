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
  const original_url = req.body.url;

  try {
    const hostname = urlParser.parse(original_url).hostname;

    dns.lookup(hostname, (err) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }

      const short_url = counter++;
      urls.push({ original_url, short_url });

      return res.json({ original_url, short_url });
    });
  } catch (e) {
    return res.json({ error: 'invalid url' });
  }
});

// ✅ GET route to redirect to original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = parseInt(req.params.short_url);
  const entry = urls.find(u => u.short_url === short_url);

  if (entry) {
    return res.redirect(302, entry.original_url);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});