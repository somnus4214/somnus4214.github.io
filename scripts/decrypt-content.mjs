#!/usr/bin/env node

import { argv, exit } from "node:process";
import {
  decryptPayload,
  getPassword,
  loadEnv,
  readJsonFile,
  writeTextFile
} from "./encryption-utils.mjs";

function usage() {
  console.error("Usage: node scripts/decrypt-content.mjs --in <cipher.json> --out <plain.md>");
  console.error("Set ENCRYPTION_PASSWORD in .env or your environment before running.");
}

function getArg(name) {
  const index = argv.indexOf(name);
  return index === -1 ? "" : argv[index + 1] || "";
}

async function main() {
  await loadEnv();

  const input = getArg("--in");
  const output = getArg("--out");

  if (!input || !output) {
    usage();
    exit(1);
  }

  const payload = await readJsonFile(input);
  const plaintext = await decryptPayload(payload, getPassword());
  await writeTextFile(output, plaintext);
}

main().catch((error) => {
  console.error(error.message || error);
  exit(1);
});
