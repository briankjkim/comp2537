const express = require('express');
const app = express();
const https = require('https');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const cors = require('cors');


app.use(cors());


// Connect to mongodb with mongoose module
mongoose.connect("mongodb://localhost:27017/test",
 {useNewUrlParser: true, useUnifiedTopology: true});


app.use(bodyparser.urlencoded({
    extended: true
  }));

app.set('view engine', 'ejs');

app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})


app.get('/profile/:id', function (req, res) {


    poke_id = req.params.id;
    const url = `https://cryptic-wildwood-03560.herokuapp.com/${poke_id}`

    data = ""

    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            data += chunk
        })

        https_res.on("end", function () {
            data = JSON.parse(data)        

            res.render("profile.ejs", {
                "id": data.id,
                "name": data.name,
                "hp": data.stats[0]["base_stat"],
                "attack": data.stats[1]["base_stat"],
                "defense": data.stats[2]["base_stat"],
                "specialAttack": data.stats[3]["base_stat"],
                "specialDefense": data.stats[4]["base_stat"],
                "speed": data.stats[5]["base_stat"],
            })
        })
    })
});

app.use(express.static('./public'));