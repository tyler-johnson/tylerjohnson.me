var _ = require("underscore");
var Promise = require("bluebird");
var getJSON = Promise.promisify(require("json-http").getJson);
var nunjucks = require("nunjucks");
var path = require("path");
var qs = require("querystring");

var app = module.exports = require("@beneaththeink/appcore")();

app.set(require("../package.json"));
app.defaults({
	cwd: path.resolve(__dirname, ".."),
	port: process.env.PORT
});

app.startup(function() {
	this.setName(this.get("name"));
	this.log.info("=== TJ.me%s ===", (version = this.get("version")) ? " v" + version : "");
	this.log.info("Starting %s application [ %s | #%s ]", this.get("env"), this.name, this.id);
});

app.running(function() {
	this.log.info("=== TJ.me started in %sms. ===", new Date - this.initDate);
});

app.use(require("@beneaththeink/appcore-router"));
app.use(require("@beneaththeink/appcore-browser"));

app.use(function() {
	var grunt = require("grunt");
	grunt.log.muted = true;

	// create a bundle
	var bundle = this.bundle = this.browser.createBundle([
		".js",
		".css"
	].map(function(ext) {
		return "dist/client" + (
			app.env === "development" ? ".dev" :
			app.env === "production" ? ".min" : ""
		) + ext;
	}), {
		watch: "lib/"
	});

	// log about changes
	bundle.on("change", function(type, fpath) {
		app.log.debug("Browser source file '%s' was %sd...",
			app.relative(fpath),
			type + (type[type.length - 1] !== "e" ? "e" : "")
		);
	});

	// log with application whenever bundle builds
	bundle.on("build:success", function() {
		app.log.info("%suilt browser application bundle: %s", bundle.firstRun() ? "B" : "Reb", bundle.name);
	});

	// display any errors
	bundle.on("build:fail", app.error, app);

	// built with grunt
	bundle.use(function(b, next) {
		if (app.env !== "development") return next();
		grunt.tasks([ "dev" ], {}, next);
	});

	// build once and make app wait
	bundle.build(app.wait());
});

app.use(function() {
	this.colors = [];

	// get colors immediately and once per day
	refreshColors();
	setInterval(refreshColors, 1000 * 60 * 60 * 24);

	function refreshColors() {
		getColors({ numResults: 30, briRange: "10,69" })
		.then(function(c) {
			app.colors.splice(0, app.colors.length);
			app.colors.push.apply(app.colors, c);
			app.log.info("Refreshed colors.");
		})
		.catch(app.error.bind(app))
		.finally(app.wait());
	}
});

app.ready(function() {
	_.extend(app.router.locals, {
		colors: this.colors,
		title: "My Name is Tyler Johnson."
	});

	// create nunjucks enviornment
	this.router.set("view engine", "html");
	var views = nunjucks.configure(__dirname + "/views", {
		watch: this.get("env") === "development",
		express: this.router,
		autoescape: true
	});

	var fontsDir = path.join(path.dirname(require.resolve("font-awesome/package.json")), "fonts");
	this.router.use("/fonts", this.router.static(fontsDir));

	this.router.get("/", function(req, res, next) {
		res.renderAppView("index", app.bundle);
	});

	this.router.use(function(req, res, next) {
		res.status(404);
		res.renderAppView("notfound", app.bundle);
	});
});

function getColors(opts) {
	var query = qs.stringify(_.extend({ format: "json" }, opts));
	return getJSON("http://www.colourlovers.com/api/colors/top?" + query);
}
