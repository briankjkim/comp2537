const express = require('express');
const app = express();
const https = require('https');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const cors = require('cors');


app.use(cors());


// Connect to mongodb with mongoose module
mongoose.connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create eventScheme for timeline events
const eventSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});

// Create eventModel for mongoose module
const eventModel = mongoose.model("timelineevents", eventSchema);


app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));



app.set('view engine', 'ejs');

app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})


// READ timeline data from the server with GET Request
app.get('/timeline/getAllEvents', function (req, res) {
    console.log("Received a GET request for timeline database");
    eventModel.find({}, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})


// CREATE a timeline event to the data with PUT Request
app.put('/timeline/insert', function (req, res) {
    console.log(req.body)
    console.log("Received a PUT request to insert a timeline event to database");
    eventModel.create({
        text: req.body.text,
        time: req.body.time,
        hits: req.body.hits,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})


// Update a timeline event by incrementing hits
app.get('/timeline/inreaseHits/:id', function (req, res) {
    console.log(req.params)
    eventModel.updateOne({
       _id : req.params.id
    }, {
        $inc : { hits: 1}
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Event is updated.");
    });
})


// Delete a timeline event from the database with GET Request
app.get('/timeline/remove/:id', function (req, res) {
    // console.log(req.params)
    eventModel.remove({
       _id : req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Event is deleted");
    });
})


// GET Request route for Pokemon Profile page
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


// Route for displaying static pages in public folder
app.use(express.static('./public'));