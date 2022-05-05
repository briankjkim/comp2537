const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// => is anonymous function; same as function(err)
// this is to display error message
app.listen(5000, (err) => {
    if (err) console.log(err);
})

app.get('/', function (req, res) {
    res.send('GET request to homepage')
})

app.get('/profile/:id', function (req, res) {
    // console.log(req);
    res.render("profile.ejs", {
        "id": req.params.id
    });
})
