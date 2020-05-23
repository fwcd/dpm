import * as path from "path/mod.ts";

export const PROJECT_JSON_PATH = path.join(Deno.cwd(), "project.json");
export const DPM_HOME_PATH = path.join(Deno.env.get("HOME") ?? "~", ".dpm")
