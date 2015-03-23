#!/usr/bin/env node
"use strict";

var express = require("express"),
  cors = require('cors'),
  config = require("config"),
  koop = require('koop')( config ),
  socrata = require('koop-socrata'),
  ckan = require('koop-ckan'),
  github = require('koop-github'),
  agol = require('koop-agol'),
  acs = require('koop-acs'),
  osm = require('koop-osm'),
  gist = require('koop-gist'),
  pgCache = require('koop-pgcache'),
  tiles = require('koop-tile-plugin'),
  zillow = require('koop-zillow');

// this is not required but is helpful
koop.registerCache( pgCache );

//register providers with koop 
koop.register( socrata ); 
koop.register( ckan ); 
koop.register( github ); 
koop.register( gist ); 
koop.register( agol ); 
koop.register( acs ); 
koop.register( osm ); 
koop.register( zillow );

// register the tiles plugin
koop.register( tiles ); 

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

