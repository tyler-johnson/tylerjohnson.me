var _ = require("underscore");
var Promise = require("bluebird");
var getJSON = Promise.promisify(require("json-http").getJson);
var nunjucks = require("nunjucks");
var path = require("path");
var qs = require("querystring");

var app = module.exports = require("@beneaththeink/appcore")("tjme");

app.defaults({ bundler: require("./browser_config.js") });

app.use(require("@beneaththeink/appcore-router"));
app.use(require("@beneaththeink/appcore-browser"));

app.init(function() {
	var colors = [];
	this.color = function() {
		return colors[Math.floor(Math.random() * colors.length)];
	}

	getColors({ numResults: 30, briRange: "0,49" })
	.then(function(c) { colors = colors.concat(c); })
	.catch(app.error.bind(app))
	.finally(app.wait());
});

app.ready(function() {
	var bundle = this.bundler.create("tjme-client");

	// create nunjucks enviornment
	this.router.set("view engine", "html");
	var views = nunjucks.configure(__dirname + "/views", {
		watch: this.get("env") === "development",
		express: this.router,
		autoescape: true
	});

	var fontsDir = path.join(path.dirname(require.resolve("font-awesome/package.json")), "fonts");
	this.router.use("/fonts", this.router.static(fontsDir));

	this.router.use(function(req, res, next) {
		res.locals.color = app.color();
		res.locals.title = "My Name is Tyler Johnson.";
		next();
	});

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
