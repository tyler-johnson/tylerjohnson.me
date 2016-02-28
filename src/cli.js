import minimist from "minimist";
import {merge,repeat} from "lodash";
import {readFileSync} from "fs";
import config from "cloud-env";

// using standard require so rollup doesn't include it
const createApp = require("./");

let argv = minimist(process.argv.slice(2), {
	string: [ "host", "port" ],
	boolean: [ "help", "version" ],
	alias: {
		h: "help", H: "help",
		v: "version", V: "version",
		c: "config",
		p: "port"
	}
});

if (argv.help) {
	console.log(`
$ tjme-server [OPTIONS]

	-c, --config <file>   Set options via a JSON config file, relative to PWD.
	-p, --port <port>     The HTTP server port.
	-h, --help            Shows this message.
	-v, --version         Prints the name and version of this software.
`.replace(/^\t+/gm, (m) => repeat("  ", m.length)));
	process.exit(0);
}

if (argv.version) {
	const pkg = JSON.parse(readFileSync(__dirname + "/package.json", "utf8"));
	console.log("%s %s", pkg.name, pkg.version || "edge");
	process.exit(0);
}

if (argv.config) {
	let src;
	try { src = readFileSync(typeof argv.config === "boolean" ? "tjme.config.json" : argv.config, "utf8"); }
	catch(e) { e; }
	if (src) merge(argv, JSON.parse(src));
}

const app = createApp(argv);

app.listen(
	argv.port || config.PORT || 8080,
	argv.host || config.HOST || "127.0.0.1",
	function() {
		const addr = this.address();
		console.log("tylerjohnson.me server listening at http://%s:%s", addr.address, addr.port);
		console.log("Enter Ctrl-C to stop the server.");
	}
).on("error", function(e) {
	console.error(e.stack || e);
	process.exit(1);
});
