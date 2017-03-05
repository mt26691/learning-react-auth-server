//Main starting port of the application
const express = require("express");

const http = require("http");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:auth/auth");

//App setup
//any incoming request will be passed to morgan and bodyParser
//morgan is logging framework
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
router(app);

//server setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);

console.log("server listing on ", port);
