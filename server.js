const express = require('express');
const app = express();
const https = require('https');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const cors = require('cors');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");



// Use Session Middleware for login component
app.use(require("express-session")({
    secret: "this course is a mess",
    resave: false,
    saveUninitialized: false
}));

// use passport authentication middleware for node.js
app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// use cross origin cors
app.use(cors());

// set view engine for ejs
app.set('view engine', 'ejs');


// open the port for nodemon and heroku
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})

// Mongodb address "mongodb+srv://kkjin0330:5VO1M61v9prYQEpp@cluster0.msyad.mongodb.net/hello"

// Connect to mongodb with mongoose module
const dbAddress = "mongodb+srv://kkjin0330:5VO1M61v9prYQEpp@cluster0.msyad.mongodb.net/hello"
mongoose
    .connect(dbAddress, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


// Create eventSchema for timeline events
const eventSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String
});


// Create eventModel for mongoose module
const eventModel = mongoose.model("timelineevents", eventSchema);


// // Create userSchema for user authentication
// const userSchema = new mongoose.Schema({
//     username: String,
//     password: String,
//     shoppingCart: Array,
// });


// // Create userModel for mongoose module
// const userModel = mongoose.model("users", userSchema);


// use body-parser
app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

// Showing user profile page
app.get("/userProfile", isLoggedIn, function (req, res) {
    res.render("secret");
});

// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});

// Handling user signup
app.post("/register", function (req, res) {
    let username = req.body.username
    let password = req.body.password
    User.register(new User({ username: username }),
            password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
 
        passport.authenticate("local")(
            req, res, function () {
            res.render("secret");
        });
    });
});


//Showing login form
app.get("/login", function (req, res) {
    res.render("login");
});
 

//Handling user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {
});


//Handling user logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}


// Timeline Event Routes
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
    console.log(req.params + "Update request received")
    eventModel.updateOne({
        _id: req.params.id
    }, {
        $inc: {
            hits: 1
        }
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
    console.log(`Remove request received for ${req.params.id}`)
    eventModel.remove({
        _id: req.params.id
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
    const url = `https://pokeapi.co/api/v2/pokemon/${poke_id}`

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