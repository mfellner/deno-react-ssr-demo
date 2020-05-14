import { readFileStr } from "https://deno.land/std/fs/mod.ts";
import { serve, ServerRequest } from "https://deno.land/std/http/server.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { renderHTML } from "./lib/render.tsx";
import { getIntFromEnv } from "./lib/util.ts";

const port = getIntFromEnv("PORT", 8000);
const s = serve({ port });

console.log(`🚀 serving at http://localhost:${port}`);

async function serveIndex(req: ServerRequest) {
  const html = await renderHTML();
  const body = "<!doctype html>\n" + html;
  const headers = new Headers({
    "Content-Type": "text/html",
  });
  req.respond({ headers, body });
}

async function serveStatic(req: ServerRequest) {
  const [, match = "?"] =
    /^\/static\/([-_\.a-zA-Z0-9]+\.(t|j)sx?)$/.exec(req.url) || [];
  const filePath = path.join("./lib/components", match);

  try {
    let body: string;
    if (match.endsWith(".tsx")) {
      const [diagnostics, emitMap] = await Deno.compile(filePath, undefined, {
        sourceMap: false,
      });

      if (diagnostics) {
        console.error(diagnostics);
        req.respond({ status: 500, body: "error" });
        return;
      }

      const [, src] =
        Object.entries<string>(emitMap).find(([key]) =>
          key.endsWith(path.basename(match, path.extname(match)) + ".js")
        ) || [];
      if (!src) {
        req.respond({ status: 404, body: "not found" });
        return;
      }
      body = src;
    } else {
      body = await readFileStr(filePath);
    }

    // const body = await readFileStr(filePath);
    const headers = new Headers({
      "Content-Type": "text/javascript",
    });
    req.respond({ headers, body });
  } catch (err) {
    if (err.name === "NotFound") {
      req.respond({ status: 404, body: "not found" });
    } else {
      console.error(err);
      req.respond({ status: 500, body: "error" });
    }
  }
}

async function serveNotFound(req: ServerRequest) {
  req.respond({ status: 404, body: "not found" });
}

for await (const req of s) {
  if (req.url === "/") {
    await serveIndex(req);
  } else if (req.url.startsWith("/static/")) {
    await serveStatic(req);
  } else {
    await serveNotFound(req);
  }
}
