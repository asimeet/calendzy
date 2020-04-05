const RouterBase = require('../lib/router-base');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs')
let uiBase =  `../../ui/controller`;
const fs = require('fs');
const fsPath = require("path");
class ControllerRouter extends RouterBase {
    constructor(req, res) {
        super();
    }
    prepareResponse() {
        this.router.get('/login.js', function (req, res) {
            let path = fsPath.resolve(__dirname, `${uiBase}/login.js`);
            let content = fs.readFileSync(path);
            res.type('.js');
            res.send(content);
        });
        this.router.get('/home.js', function (req, res) {
            let path = fsPath.resolve(__dirname, `${uiBase}/home.js`);
            let content = fs.readFileSync(path);
            res.type('.js');
            res.send(content);
        });
    }
}


module.exports = ControllerRouter;