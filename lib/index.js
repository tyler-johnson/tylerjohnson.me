var _ = require("underscore");
var Promise = require("bluebird");
var getJSON = Promise.promisify(require("json-http").getJson);
var nunjucks = require("nunjucks");
var path = require("path");
var qs = require("querystring");

var app = module.exports = require("@beneaththeink/appcore")();

app.set(require("../package.json"));
app.defaults({
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
	if (this.env !== "development") return;

	var grunt = require("grunt");
	var self = this;
	grunt.log.muted = true;

	grunt.tasks([ "dev" ], {}, app.wait(function(err) {
		if (err) return app.error(err);

		grunt.tasks("watch:dev", {}, function(err) {
			if (err) app.error(err);
		});

		grunt.event.on('watch', function(action, filepath) {
			app.log.debug("'%s' has %s", filepath, action);
		});

		app.log.info("Built client files.");
	}));
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

function bundleName(env, ext) {
	return "dist/client" + (
		env === "development" ? ".dev" :
		env === "production" ? ".min" : ""
	) + ext;
}

app.ready(function() {
	var bundle = this.browser.createBundle([
		bundleName(this.env, ".js"),
		bundleName(this.env, ".css")
	]);

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
		res.renderAppView("index", bundle);
	});

	this.router.use(function(req, res, next) {
		res.status(404);
		res.renderAppView("notfound", bundle);
	});
});

function getColors(opts) {
	var query = qs.stringify(_.extend({ format: "json" }, opts));
	return getJSON("http://www.colourlovers.com/api/colors/top?" + query);
}
