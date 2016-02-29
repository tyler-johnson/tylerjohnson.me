import express from "express";
import nunjucks from "nunjucks";
import {colors} from "./colors";
import {assign,pick} from "lodash";
import {hostname} from "os";

const defaults = {
	version: "edge",
	...pick(require("./package.json"), "name", "version"),
	hostname: hostname()
};

export default function createApp(opts) {
	let app = express();
	opts = assign({}, defaults, opts);

	// create nunjucks enviornment
	app.set("view engine", "html");
	app.nunjucks = nunjucks.configure(__dirname + "/views", {
		express: app,
		autoescape: true
	});

	// construct template data
	assign(app.locals, {
		...pick(opts, "name", "version"),
		...opts.template,
		colors,
		title: "My Name is Tyler Johnson."
	});

	app.disable("x-powered-by");
	app.use(function(req, res, next) {
		res.set("X-Served-By", `${opts.name} ${opts.version} (${opts.hostname})`);
		next();
	});

	// home page
	app.get("/", function(req, res) {
		res.render("index");
	});

	// styles
	app.get("/styles.css", function(req, res) {
		res.sendFile(__dirname + "/styles.css");
	});

	// 404
	app.use(function(req, res) {
		res.status(404).render("notfound");
	});

	return app;
}
