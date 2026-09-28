import fs from "node:fs/promises";

export async function resolve(specifier, context, nextResolve) {
  try { return await nextResolve(specifier, context); }
  catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[cm]?js$/.test(specifier)) {
      return nextResolve(`${specifier}.js`, context);
    }
    throw error;
  }
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".json")) {
    const body = await fs.readFile(new URL(url), "utf8");
    return { format: "module", source: `export default ${body};`, shortCircuit: true };
  }
  return nextLoad(url, context);
}
