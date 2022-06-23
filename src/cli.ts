import minimist from "minimist";
import rc from "rc";
import fs from "fs";
import path from "path";
import { Server } from "http";
import createApp from "./index";

const pkgsrc = fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8");
const pkg = JSON.parse(pkgsrc);

const argv = minimist(process.argv.slice(2), {
  boolean: ["help", "version"],
  alias: {
    h: "help",
    H: "help",
    v: "version",
    V: "version",
    c: "config",
    p: "port",
  },
});

if (argv.help) {
  console.log(`
$ tjme-server [OPTIONS]

  -c, --config <file>   Set options via a JSON config file, relative to PWD.
  -p, --port <port>     The HTTP server port.
  -h, --help            Shows this message.
  -v, --version         Prints the name and version of this software.
`);
  process.exit(0);
}

if (argv.version) {
  console.log("%s %s", pkg.name, pkg.version);
  process.exit(0);
}

const conf = rc("tjme", {}, argv);

if (conf.production) {
  process.env.NODE_ENV = "production";
} else if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

let host, port;

if (conf.bind && typeof conf.bind === "string") {
  [host, port] = conf.bind.split(":");
}

if (!host) host = conf.host || "127.0.0.1";
if (!port) port = conf.port || process.env.PORT || "3000";

const app = createApp({
  hostname: conf.hostname,
  template: conf.template,
  name: conf.name,
  version: conf.version,
});

app
  .listen(port, host, function (this: Server) {
    const addr = this.address();

    if (typeof addr === "string") {
      console.log("tylerjohnson.me server listening at %s", addr);
    } else if (addr != null) {
      console.log("tylerjohnson.me server listening at http://%s:%s", addr.address, addr.port);
    }

    console.log("Enter Ctrl-C to stop the server.");
  })
  .on("error", function (e) {
    console.error(e.stack || e);
    process.exit(1);
  });
