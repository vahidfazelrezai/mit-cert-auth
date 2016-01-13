// packages
var scp = require('scp');
var fs = require('fs');

// import config
var config = require('./config');
config.scriptsPath = config.scriptsPath.replace(/^\/|\/$/g, '').replace(/^[^\/]/g, '/$&'); // enforce "/p1/p2" slash format

// contents of auth-secret.php
var contents = '<?php $secret = \'' + config.authSecret + '\'; $login_url = \'' + config.loginUrl + '\'; ?>';

// write auth-config.php locally
fs.writeFile('auth-secret.php', contents, function () {

    // deploy auth.php and auth-secret.php to scripts
    console.log('Please log in to ' + config.scriptsUsername + ' on athena...')
    scp.send({
        file: '{./auth.php,./auth-secret.php}',
        user: config.scriptsUsername,
        host: 'athena.dialup.mit.edu',
        path: '~/web_scripts' + config.scriptsPath + '/'
    }, function (err) {
        if (err) console.log(err);

        // delete auth-secret.php locally
        fs.unlink('auth-secret.php'); // comment this line to preserve file
    });
});
