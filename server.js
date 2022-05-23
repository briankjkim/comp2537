const express = require('express');
const app = express();
const https = require('https');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const cors = require('cors');

const req = require('express/lib/request');
const res = require('express/lib/response');
const cookieParser = require("cookie-parser");

const { User } = require("./public/models/User");
const { auth } = require("./public/middleware/auth");

var url = require('url');
const { request } = require('http');

app.use(bodyparser.json());
app.use(cookieParser());

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

// use cross origin cors
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// set view engine for ejs
app.set('view engine', 'ejs');


// open the port for nodemon and heroku
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})



// Show home route
app.get('/', function (req, res) {
    if (req.cookies.x_auth) {
        res.sendFile(__dirname + '/public/index.html');
    } else {
        console.log("user not signed");
        res.render('login.ejs');
    }
})



// Passport codes
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: 'hello',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))



// Mongodb address "mongodb+srv://kkjin0330:5VO1M61v9prYQEpp@cluster0.msyad.mongodb.net/hello"

// Connect to mongodb with mongoose module
const dbAddress = "mongodb+srv://kkjin0330:5VO1M61v9prYQEpp@cluster0.msyad.mongodb.net/hello"
mongoose
    .connect(dbAddress, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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



// Create userSchema for user authentication
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    useremail: String,
    shoppingCart: Array,
});


// Create userModel for mongoose module
const userModel = mongoose.model("users", userSchema);




// use body-parser
app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));


// Show home route
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', {
        "username": req.user.name,
    })
  })


// Showing register form
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

// Handle register 
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // userModel.create({
        //     username: req.body.name,
        //     useremail: req.body.email,
        //     password: hashedPassword
        // }), function (err, data) {
        //     if (err) {
        //         console.log("Error " + err);
        //     } else {
        //         console.log("Data " + data);
        //     }
        //     res.redirect('/');
        // }
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
          })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})


//Showing login form
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

// Handling login 
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}))


// Handling user logout
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

// Session middleware
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
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