import fetch from "node-fetch";
import qs from "querystring";
import { URL } from "url";

export interface ColorObject {
  url: string;
  title: string;
  hex: string;
}

export function isColorObject(obj: any): obj is ColorObject {
  return obj != null && typeof obj.url === "string" && typeof obj.title === "string" && typeof obj.hex === "string";
}

export const colors: ColorObject[] = [];

export async function refresh() {
  const result = await getColors({ numResults: 30, briRange: "10,69" });
  if (!Array.isArray(result)) return [];

  const c = result.filter(isColorObject);
  colors.splice(0, colors.length);
  colors.push(...c);
  return c;
}

export async function getColors(opts: any) {
  const url = new URL("http://www.colourlovers.com/api/colors/top");
  url.search = qs.stringify({ ...opts, format: "json" });

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error("Failed to fetch.");
  }

  return await resp.json();
}

async function update() {
  try {
    await refresh();
  } catch (e) {
    console.error("Problem fetching colors.");
    console.error(e.stack || e);
  }
}

// grab immediately and every 24 hours
update();
setInterval(update, 1000 * 60 * 60 * 24);
