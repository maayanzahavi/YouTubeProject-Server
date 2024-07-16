const jwt = require("jsonwebtoken");
const key = "I<3DuaLipa";

// Generate a token
function getToken(req) {
    const data = { email: req.body.email };
    // Generate the token.
    const token = jwt.sign(data, key);
    // Return the token to the browser
    return token;
  }

const isLoggedIn = (req, res, next) => {
    // Check if the request has an authorization header
    console.log("reacded token isLoggedIn");
    console.log("reacded token isLoggedIn", req.headers.authorization);
    if (req.headers.authorization) {
        console.log("reacded token isLoggedIn has token");
        // Extract the token from the header
        const token = req.headers.authorization.split(" ")[1];
        console.log("reacded token isLoggedIn token ", token);
        try {
            // Verify the token is valid
            const data = jwt.verify(token, key);
            console.log('The logged in user is: ' + data.email);
            // Attach user data to request object for use in other routes
            req.user = data;
            console.log("token is valid, calling next()");
            // Token validation was successful. Continue to the actual function (next)
            return next();
        } catch (err) {
            console.log("catch token isLoggedIn");
            return res.status(401).send("Invalid Token");
        }
    } else {
        console.log("failed token isLoggedIn");
        return res.status(403).send('Token required');
    }
};


module.exports = { isLoggedIn, getToken };
  