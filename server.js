const express = require('express')
const app = express()


app.set('view engine', 'ejs');  


app.listen(5000, function (err) {
    if (err) console.log(err);
})


app.get('/profile/:id', function(res, req){
    res.render("profile.ejs", {
        "id": req.params.id
    });
})

app.use(express.static('./public'));