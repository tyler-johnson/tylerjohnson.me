var NPMImporter = require("less-plugin-npm-import");
var path = require("path");

var pddir = ezpath("..") + "/";

function ezpath(p) {
	return path.resolve(__dirname, p);
}

module.exports = {
	"id": "tjme",
	"cacheDir": ezpath("../dist"),
	"mountpath": "/_browser",
	"extensions": {
		"style": [ ".less" ]
	},
	"transforms": [
		[ require("@beneaththeink/less-transform"), {
			plugins: [ new NPMImporter({ prefix: "~" }) ]
		} ]
	],
	"bundles": {
		"tjme-client": [
			ezpath("client.js"),
			ezpath("styles.less")
		]
	}
}
