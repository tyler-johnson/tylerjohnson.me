import {assign} from "lodash";
import _request from "request";
import promisify from "es6-promisify";

const request = promisify(_request);

export const colors = [];

export async function refresh() {
	let c = await fetch({ numResults: 30, briRange: "10,69" });
	colors.splice(0, colors.length);
	colors.push.apply(colors, c);
	return c;
}

export async function fetch(opts) {
	let {body} = await request({
		url: "http://www.colourlovers.com/api/colors/top",
		qs: assign({ format: "json" }, opts),
		json: true
	});

	return body;
}

async function update() {
	try {
		await refresh();
	} catch(e) {
		console.error("Problem fetching colors.");
		console.error(e.stack || e);
	}
}

// grab immediately and every 24 hours
update();
setInterval(update, 1000 * 60 * 60 * 24);
