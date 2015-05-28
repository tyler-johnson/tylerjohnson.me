var _ = require("underscore");
var Promise = require("bluebird");
var getJSON = Promise.promisify(require("json-http").getJson);
var nunjucks = require("nunjucks");
var path = require("path");
var qs = require("querystring");

var app = module.exports = require("@beneaththeink/appcore")("tjme");

app.set(require("../package.json"));
app.defaults({
	port: process.env.PORT,
	bundler: require("./bundler_config.js")
});

app.init(function() {
	if (app.get("env") === "production") app.set({ bundler: { cacheMode: true } });
	this.log.root("=== TJ.me%s ===", (version = this.get("version")) ? " v" + version : "");
	this.log.root("Starting %s server (build %s)", this.get("env"), this.id);
});

app.running(function() {
	this.log.root("=== Pagedip started in %sms. ===", new Date - this.initDate);
});

app.use(require("@beneaththeink/appcore-router"));
app.use(require("@beneaththeink/appcore-browser"));

app.init(function() {
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
	var bundle = this.bundler.create("tjme-client");

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
		res.renderAppView("notfound", bundle);
	});
});

function getColors(opts) {
	var query = qs.stringify(_.extend({ format: "json" }, opts));
	return getJSON("http://www.colourlovers.com/api/colors/top?" + query);
}
