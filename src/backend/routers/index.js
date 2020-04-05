const routers = {
    "login" : () => {
        let handler = require("./login.router.js");
        let router = new handler().router;
        return router;
    },
    "controller" : () => {
        let handler = require("./controller.router.js");
        let router = new handler().router;
        return router;
    },
    "home" : () => {
        let handler = require("./home.router.js");
        let router = new handler().router;
        return router;
    },
    "appointment" : () => {
        let handler = require("./appointment.router");
        let router = new handler().router;
        return router;
    }
}
module.exports = routers;