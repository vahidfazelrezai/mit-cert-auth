// packages
var app = require('express')();
var randomstring = require('randomstring');
var sha256 = require('sha256');
var cookieSession = require('cookie-session');

// import config file
var config = require('./config');
config.scriptsPath = config.scriptsPath.replace(/^\/|\/$/g, '').replace(/^[^\/]/g, '/$&'); // enforce "/p1/p2" slash format

// enable cookie sessions (to be able to store key in req.session)
app.use(cookieSession({secret: config.cookieSecret}))

// root endpoint generates random key and displays link
app.get('/', function (req, res) {

    // generate random key and redirect url
    var authUrl = 'https://' + config.scriptsUsername + '.scripts.mit.edu:444' + config.scriptsPath + '/auth.php';
    var key = randomstring.generate(10);
    var linkUrl = authUrl + '?key=' + key;

    // store key in session
    req.session.key = key;

    // send message with link
    res.send('hello! click <a href="' + linkUrl + '">here</a> to log in');
});

// login endpoint verifies token given email, token, and name in query string
app.get('/login', function (req, res) {

    // get query params
    var email = req.query.email;
    var token = req.query.token;
    var name = req.query.name;

    // compute token
    var key = req.session.key;
    var secret = config.authSecret;
    var correctToken = sha256(email + key + secret);

    // check token
    if (token === correctToken) {
        res.send(name + ' was authenticated!');
    } else {
        res.send('oops... authentication failed')
    }
});

// start listening
app.listen(8000, function () {
    console.log('example-app listening on port 8000');
})
