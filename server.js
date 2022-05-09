const express = require('express')
const app = express()
const https = require('https');

app.set('view engine', 'ejs');

app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})


app.get('/profile/:id', function (req, res) {

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    data = ""

    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            data += chunk
        })

        https_res.on("end", function () {
            data = JSON.parse(data)

            pokeObj = data.stats.filter((obj_poke)=>{
                return obj_poke.stat.name == "hp"
            }).map((obj_poke2)=> {
                return obj_poke2.base_stat
            })

            res.render("profile.ejs", {
                "id": req.params.id,
                "name": data.name,
                "hp":pokeObj[0],
            })
        })
    })
});

app.use(express.static('./public'))