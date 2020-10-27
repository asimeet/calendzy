const express = require('express');
const config = require ("../.config");
const userMdl = require ("./user-model");
const auth =  require("./auth");

class RouterBase{
    constructor(){
        this.router = express.Router();
        this.config = config;
        this.userMdl = userMdl;
        this.auth = auth;
        this.prepareResponse();
    }
    prepareResponse(){
        //to be inplemented by child classes
    }
}

module.exports = RouterBase;