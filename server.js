const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
var User = require("./UserSchema").userModel;
var userInst = new User;

const app = express();

console.log(`process.env.APP_MONGO_URI`, process.env.APP_MONGO_URI);
console.log(`process.env.APP_JWT_SECRET`, process.env.APP_JWT_SECRET);
mongoose.connect(process.env.APP_MONGO_URI, (err, connected) => {
    if (err) {
        
    } else {
        console.log("Connected to Mongo DB successfully.. ");
    }
})

app.use(bodyParser.json());

app.use(cors());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://0.0.0.0:8081');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//here we are configuring dist to serve app files
app.use('/', serveStatic(path.join(__dirname, 'client/dist')))

// this * route is to serve project on different page routes except root `/`
app.get(/.*/, function (req, res) {
	res.sendFile(path.join(__dirname, '/client/dist/index.html'))
})

app.post('/api/adduser', (req, res) => {
    var { name, email, userName, password, userType, mentees } = req.body;
    var payload = {
        name,
        email,
        userName,
        userType,
        mentees
    }

    User.find({ email: email }).then(userData => {
        if (userData.length) {
            res.json({
                message: "User already exists with this email Id"
            });
        } else {
            try {
                var addUser = new User(payload);
                console.log(`addUser`, addUser)

                addUser.password = addUser.generateHash(password);
                addUser.save();

                res.json({
                    message: "User added successfully !"
                })
            }

            catch (err) {
                res.json({
                    errorMessage: err
                })
            }
        }
    }).
        catch(err => {
            res.json({
                errorMessage: err
            })
        })
})

app.post('/login', (req, res) => {
    var { email, username, password } = req.body;
    if (email) {
        var filter = {
            email
        }
    } else {
        var filter = {
            username
        }
    }

    User.findOne(filter).exec(async (err, userData) => {
        if (err) {
            res.json({
                errorMessage: err
            })
        } else {
            if (userData) {

                var isValidPassword = await userData.validPassword(password);

                console.log(`isValidPassword`, isValidPassword);

                if (!isValidPassword) {
                    res.json({
                        errorMessage: "Invalid EmailId or password"
                    })
                } else {
                    try {
                        var userDataObj = userData.toObject();
                        delete userDataObj.password;
                        console.log(`userData`, userDataObj)
                        var token = jwt.sign(userDataObj, process.env.APP_JWT_SECRET);

                        // userData.token = jwt.sign(userDataObj, (process.env.APP_JWT_SECRET || 'secret#019283$'));
                        // userData.save();

                        res.json({
                            message: "Login successful",
                            token: token,
                            userType: userDataObj.userType,
                            email: userDataObj.email
                        })
                    }

                    catch (err) {
                        res.json({
                            errorMessage: err
                        })
                    }

                }
            } else {
                console.log("User not found");
                res.json({
                    errorMessage: "User not found"
                })
            }
        }
    })
})

app.get('/api/users', (req, res) => {
    User.find({}, { "_id": 0, "name": 1, "mobile": 1, "email": 1, "userName": 1, "userType": 1, "mentees": 1 }).then(result => {
        console.log(`result`, result);
        res.json(result);
    })
        .catch(err => {
            res.status(400).json({ message: err })
        })
})

app.use('*', function (req, res, next) {
    console.log("In middleware");
    console.log(`req`, req)
    console.log(`req.url`, req.url)
    if (req.url.startsWith("/api")) {
        if (req.headers && req.headers.authorization) {
            try {
                var token = req.headers.authorization.split(" ")[1],
                    emailFromToken = jwt.verify(token, process.env.APP_JWT_SECRET).email;
                if (emailFromToken) {
                    User.find({ email: emailFromToken }).then(user => {
                        if (user && user._id) {
                            next();
                        } else {
                            next(new Error({ message: "Unauthorized" }));
                        }
                    })
                }
            }
            catch (err) {
                next(new Error({ message: "Unauthorized" }))
            }
        } else {
            next(new Error({ message: 'Unauthorized' }))
        }
    } else {
        next();
    }
})

const port = process.env.APP_PORT || 8085;
app.listen(port);
console.log(`app is listening on port: ${port}`);