// Express boilerplate
const express = require('express');
const app = express();
const PORT = process.env.PORT || 9164;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static content lives in public
app.use(express.static("public"));


// static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

// Routes
const routes = require('./routes/htmlroutes');
app.use(routes)

// Database here if you're using one


// Listener function
app.listen(PORT, function() {
    console.log('Listening on PORT http://localhost:' + PORT);
});