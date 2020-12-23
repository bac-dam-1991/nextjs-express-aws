const express = require("express");
const server = express();
// const next = require("next");
// const config = require("../client/next.config");
// const dev = process.env.NODE_ENV !== "production";

// const app = next({ dev, conf: config });
// const requestHandler = app.getRequestHandler();

// async function init() {
// 	await app.prepare();
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

// server.get("/", (req, res) => app.render(req, res, "/"));
// server.get("*", (req, res) => requestHandler(req, res));
// }

// init();

module.exports = server;
