# mit-cert-auth

This is an example of how an endpoint on an MIT scripts site can authenticate MIT certificates for servers not hosted on an MIT domain.

## Explanation

It is possible to easily authenticate MIT certificates on a [scripts.mit.edu](https://scripts.mit.edu/) website. The aim is to securely utilize this capability on an external server that cannot itself authenticate certificates.

There are two components: the scripts authentication endpoint (`auth.php`) and an external server (`example-app.js`) that hosts an app. The flow is as follows:
1. A user goes to the app and attempts to log in.
2. The server generates a random key, storing it in the user's app session. It then redirects the user to the authentication endpoint, passing the key in the query string.
3. The authentication endpoint requests a certificate from the user. (If the user doesn't provide a valid certificate, the authentication fails.)
4. The authentication endpoint computes the hash of the concatenation of the user's email (from certificate), random key, and a server secret (stored on both the authentication endpoint and the app server). The result is an alphanumeric token.
5. The authentication endpoint redirects the user back to the app and passes the user's email, token, and name.
6. The app also computes the hash of the concatenation of the user's email, random key (reloaded from the session), and the server secret. If the result matches the given token, the user is authenticated.

## Instructions

This assumes you have installed Node.js and npm.

First, install packages by running `npm install`. You will probably also want to customize `config.json` (in particular the `scriptsUsername` field).

Now the authentication endpoint must be deployed on MIT scripts, which is done by running `node deploy-auth.js`. Note that this puts two files, `auth.php` and `auth-secret.php`, at the path specified in `config.json`. (An MIT Athena account is required for this step.)

Finally, start the example app by running `node example-app.js`. You can test it out by going to http://localhost:8000.
