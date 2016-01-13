<?php
    # requires $secret and $login_url to be set appropriately in auth-secret.php
    include 'auth-secret.php';

    # start as valid
    $valid = True;

    # check for and get key from query params
    if (isset($_GET['key'])) {
        $key = $_GET['key'];
    } else {
        $valid = False;
    }

    # check for and get name and email from certificate
    if (@$_SERVER['SSL_CLIENT_S_DN_Email']) {
        $email = strtolower($_SERVER['SSL_CLIENT_S_DN_Email']);
        $name = $_SERVER['SSL_CLIENT_S_DN_CN'];

        # hash concatenation of email/key/secret (uses SHA256 with cost=10)
        $options = array('cost' => 10);
        $token = hash('sha256', $email . $key . $secret);

        # construct redirect url
        $redirect_url = $login_url . '?email=' . $email . '&name=' . $name . '&token=' . $token;
    } else {
        $valid = False;
    }

    # on success
    $success_meta = '<meta http-equiv="refresh" content="1; url=' . $redirect_url . '" />';
    $success_message = 'Redirecting...';

    # on error
    $error_meta = '<meta charset="utf-8">';
    $error_message = 'Log in failed (requires valid MIT certificate)';
?>

<!DOCTYPE html>
<html>
    <head>
        <?php echo $valid ? $success_meta : $error_meta; ?>
        <title>ProjX Auth</title>
    </head>
    <body>
        <?php echo $valid ? $success_message : $error_message; ?>
    </body>
</html>
