const express = require("express");
const server = express();

server.get("/", (req, res) => {
	res.send("GET endpoint called.");
});

server.post("/", (req, res) => {
	res.send("POST endpoint called.");
});

server.put("/", (req, res) => {
	res.send("PUT endpoint called.");
});

server.delete("/", (req, res) => {
	res.send("DELETE endpoint called.");
});

module.exports = server;
