#!/usr/bin/env node

import { kevinify } from "../src/index.js";

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith("--")));
const rest = args.filter(a => !a.startsWith("--"));

const readStdin = async (): Promise<string> =>
  new Promise(resolve => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    if (process.stdin.isTTY) resolve("");
  });

(async () => {
  const input =
    rest.length > 0
      ? rest.join(" ")
      : await readStdin();

  if (!input) {
    console.error("Usage: kevinify \"Your text here\"  (or pipe stdin)");
    process.exit(1);
  }

  const out = kevinify(input, {
    removeStopwords: !flags.has("--keep-stopwords"),
    preserveEntities: !flags.has("--no-preserve"),
    keepCase: flags.has("--keep-case"),
    shortenLongWords: !flags.has("--no-shorten")
  });

  process.stdout.write(out + "\n");
})();

