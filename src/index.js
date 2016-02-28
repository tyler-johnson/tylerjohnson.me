import express from "express";
import nunjucks from "nunjucks";
import {colors} from "./colors";

export default function createApp() {
	let app = express();

	// create nunjucks enviornment
	app.set("view engine", "html");
	app.nunjucks = nunjucks.configure(__dirname + "/views", {
		express: app,
		autoescape: true
	});

	app.locals.title = "My Name is Tyler Johnson.";
	app.locals.colors = colors;

	app.get("/", function(req, res) {
		res.render("index");
	});

	app.get("/styles.css", function(req, res) {
		res.sendFile(__dirname + "/styles.css");
	});

	app.use(function(req, res) {
		res.status(404).render("notfound");
	});

	return app;
}
