const express = require('express');
const exphbs = require("express-handlebars");
const path = require('path');
const mongoose = require('mongoose');
const hbsHelpers = require('./src/backend/lib/hbs-helpers');
const config = require("./src/backend/config");
const routers = require("./src/backend/routers");
const auth = require('./src/backend/lib/auth')

const app = express();

const bodyParser = require('body-parser');

mongoose.connect(config['mongo-url']);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'src/ui/views'));
app.use(express.static(path.join(__dirname, 'src/assets')))

// const hbs = exphbs.create(hbsHelpers);
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: null
}));
app.set('view engine', '.hbs');

let routingKeys = Object.keys(routers);
routingKeys.forEach(rkey => {
    app.use(`/${rkey}`, routers[rkey]());
});

app.get("/*", auth.verifyToken, (req, res) => {
    if (req.path == '/') {
        if (req.userId) {
            res.redirect('/home');
        } else {
            res.redirect("/login");
        }
    }
});

app.use(function (err, req, res, next) {
    if (err) {
        res.statusMessage = err.message
        res.status(500);
        res.send(err.message)
    }
});

app.listen(config['app-port'], () => {
    console.log(`Server is running at localhost:${config['app-port']}`);
});