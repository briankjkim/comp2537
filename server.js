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
const session = require('express-session')




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


// use body-parser
app.use(bodyparser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));


// Show home route
app.get('/', function (req, res) {
    if (req.cookies.x_auth) {
        res.sendFile(__dirname + '/public/index.html');
    } else {
        console.log("User is not signed in");
        res.sendFile(__dirname + '/public/login.html');
    }
})

// Handle login
app.post("/doLogin", (req, res) => {
    User.findOne({ ID: req.body.ID }, (err, user) => {
        if (err || !user) {
            alert("Invalid ID!");
            return res.sendFile(__dirname + '/public/signup.html');
        }
        user
            .comparePassword(req.body.password)
            .then((isMatch) => {
                if (!isMatch) {
                    alert("Invalid Password!");
                    return res.sendFile(__dirname + '/public/signup.html');
                }
                user
                    .generateToken()
                    .then((user) => {
                        res.cookie("userNickName", user.nickname);
                        res.cookie("x_auth", user.token);
                        res.sendFile(__dirname + '/public/index.html');
                    })
                    .catch((err) => {
                        res.status(400).send(err);
                    });
            })
            .catch((err) => res.json({ loginSuccess: false, err }));
    });
});


// Handle register
app.post("/doJoin", (req, res) => {
    const user = new User(req.body);
    user.save((err, userInfo) => {
        if (err) return res.sendFile(__dirname + '/public/signup.html');
        return res.redirect('/')
    });
});


// Middleware for auth
app.get("/api/user/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        nickname: req.user.nickname,
        cellphone: req.user.cellphone,
    });
});

// Handle log out
app.post("/logout", auth, (req, res) => {

    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        res.clearCookie("x_auth");
        return res.sendFile(__dirname + '/public/login.html');
    });
});


const shoppingCartSchema = new mongoose.Schema({
    userID: String,
    pokeID: Number,
    quantity: Number,
    time: String,
    price: Number,
});

const shoppingCartModel = mongoose.model("shoppingCart", shoppingCartSchema);


// Show shopping cart
app.get('/getShoppingCart', (req, res)  => {
    shoppingCartModel.find().then(results => {
        res.render('userProfile.ejs', { result: results })
    })
    .catch(err => console.error(error))
})


// Add items to shopping cart
app.post('/profile/:id/addItem', auth, (req, res) => {
    let today = new Date();
    shoppingCartModel.create({
        userID: req.user.ID,
        pokeID: req.body.pokID,
        quantity: req.body.quantity,
        time: today,
        price: req.body.price
    }, function (err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Data " + data);
        }
        console.log("Insertion is successful");
      });
})

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