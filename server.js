const express = require('express')
const app = express()

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
    res.send(`<h1> GOTTA GET GIT ID is ${req.params.id} </h1>`)
})
