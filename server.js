#!/usr/bin/env node
"use strict";

var express = require("express"),
  cors = require('cors'),
  config = require("config"),
  koop = require('koop')( config ),
  acs = require('koop-acs'),
  census = require('koop-census'),
  agol = require('koop-agol'),
  esCache = require('koop-escache');

// this is not required but is helpful
koop.registerCache( esCache );

//register providers with koop 
koop.register( acs ); 
koop.register( agol ); 
koop.register( census ); 

// create an express app
var app = express();
app.use( cors() );

app.use(function(req,res,next){
  var oldEnd = res.end;

  res.end = function() {
    oldEnd.apply(res, arguments);
  };

  next();
});

app.use(function (req, res, next) {
  res.removeHeader("Vary");
  next();
});

// add koop middleware
app.use( koop );

app.get('/status', function(req, res){
  res.json( koop.status );
});

app.set('view engine', 'ejs');

// serve the index
app.get("/", function(req, res, next) {
  res.render(__dirname + '/views/index');
});

app.listen(process.env.PORT || config.server.port,  function() {
  console.log("Listening at http://%s:%d/", this.address().address, this.address().port);
});

