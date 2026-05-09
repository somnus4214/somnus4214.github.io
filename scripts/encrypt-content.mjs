#!/usr/bin/env node

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { argv, exit } from "node:process";
import { dirname } from "node:path";
import { encryptText, getPassword, loadEnv } from "./encryption-utils.mjs";

function usage() {
  console.error(
    "Usage: node scripts/encrypt-content.mjs --in <plain.md> --out <cipher.json> --title <title>"
  );
  console.error(
    "   or: node scripts/encrypt-content.mjs --text <markdown> --out <cipher.json> --title <title>"
  );
  console.error("Set ENCRYPTION_PASSWORD in .env or your environment before running.");
}

function getArg(name) {
  const index = argv.indexOf(name);
  return index === -1 ? "" : argv[index + 1] || "";
}

async function main() {
  await loadEnv();

  const input = getArg("--in");
  const text = getArg("--text");
  const output = getArg("--out");
  const title = getArg("--title") || "Encrypted content";

  if ((!input && !text) || !output) {
    usage();
    exit(1);
  }

  const plaintext = input ? await readFile(input, "utf8") : text;
  const payload = await encryptText(plaintext, getPassword(), title);

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  exit(1);
});
