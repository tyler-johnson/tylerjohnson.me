import fetch from "node-fetch";
import randomcolor from "randomcolor";

export interface ColorAPIData {
  hex: {
    value: string;
    clean: string;
  };
  name: {
    value: string;
    closest_named_hex: string;
    exact_match_name: boolean;
    distance: number;
  };
}

export function isColorAPIData(obj: any): obj is ColorAPIData {
  return (
    obj != null &&
    obj.name != null &&
    typeof obj.name.value === "string" &&
    typeof obj.name.closest_named_hex === "string" &&
    typeof obj.name.exact_match_name === "boolean" &&
    typeof obj.name.distance === "number" &&
    obj.hex != null &&
    typeof obj.hex.value === "string" &&
    typeof obj.hex.clean === "string"
  );
}

export const colors: ColorAPIData[] = [];

export async function refresh() {
  const result = await getColors(20);
  if (!Array.isArray(result)) return [];

  colors.splice(0, colors.length);
  colors.push(...result);
  return colors;
}

export async function getColors(count: number) {
  const randhex = Array.from(new Array(count), () => randomcolor({ luminosity: "dark", format: "hex" }).substring(1));
  const result: ColorAPIData[] = [];

  for (const hex of randhex) {
    const resp = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`);

    if (!resp.ok) {
      throw new Error("Failed to fetch.");
    }

    const data = await resp.json();

    if (!isColorAPIData(data)) {
      throw new Error("Invalid response.");
    }

    result.push(data);

    // sleep a bit since this is a free API
    await new Promise((ok) => setTimeout(ok, 500));
  }

  return result;
}

export function getRandomColor(): ColorAPIData {
  return colors[Math.floor(Math.random() * colors.length)];
}

async function update() {
  try {
    await refresh();
    console.log("[%s] Colors Updated.", new Date().toISOString());
  } catch (e) {
    console.error("Problem fetching colors.");
    console.error(e.stack || e);
  }
}

// grab immediately and every 24 hours
update();
setInterval(update, 1000 * 60 * 60 * 24);
