import express, { Application } from "express";
import nunjucks from "nunjucks";
import os from "os";
import fs from "fs";
import path from "path";
import { getRandomColor } from "./colors";

const pkgsrc = fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8");
const pkg = JSON.parse(pkgsrc);

export interface Options {
  name?: string;
  version?: string;
  hostname?: string;
  template?: Record<string, any>;
}

export default function (opts: Options = {}) {
  const { name = pkg.name, version = pkg.version || "edge", hostname = os.hostname(), template } = opts;

  const app: Application & {
    nunjucks: nunjucks.Environment;
  } = express() as any;

  // create nunjucks enviornment
  app.set("view engine", "html");
  app.nunjucks = nunjucks.configure(path.join(__dirname, "../views"), {
    express: app,
    autoescape: true,
    watch: process.env.NODE_ENV === "development",
  });

  // construct template data
  Object.assign(app.locals, {
    name,
    version,
    ...template,
    getRandomColor,
    title: "My Name is Tyler Johnson.",
  });

  app.disable("x-powered-by");
  app.use(function (req, res, next) {
    res.set("X-Served-By", `${name} ${version} (${hostname})`);
    next();
  });

  // public folder
  app.use("/assets", express.static(path.join(__dirname, "../public")));

  // home page
  app.get("/", function (_, res) {
    res.render("index");
  });

  // 404
  app.use(function (_, res) {
    res.status(404).render("notfound");
  });

  return app;
}
