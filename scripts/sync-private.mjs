#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { argv, exit } from "node:process";
import {
  decryptPayload,
  encryptText,
  getPassword,
  loadEnv,
  readJsonFile,
  writeJsonFile,
  writeTextFile
} from "./encryption-utils.mjs";

function usage() {
  console.error("Usage: node scripts/sync-private.mjs --encrypt [--manifest encrypted-manifest.json]");
  console.error("   or: node scripts/sync-private.mjs --decrypt [--manifest encrypted-manifest.json]");
  console.error("Set ENCRYPTION_PASSWORD in .env or your environment before running.");
}

function getArg(name) {
  const index = argv.indexOf(name);
  return index === -1 ? "" : argv[index + 1] || "";
}

async function main() {
  await loadEnv();

  const shouldEncrypt = argv.includes("--encrypt");
  const shouldDecrypt = argv.includes("--decrypt");
  const manifestPath = getArg("--manifest") || "encrypted-manifest.json";

  if (shouldEncrypt === shouldDecrypt) {
    usage();
    exit(1);
  }

  const entries = await readJsonFile(manifestPath);
  const password = getPassword();

  if (!Array.isArray(entries)) {
    throw new Error(`${manifestPath} must be a JSON array.`);
  }

  for (const entry of entries) {
    if (!entry.plain || !entry.cipher) {
      throw new Error("Each manifest entry needs plain and cipher paths.");
    }

    if (shouldEncrypt) {
      const plaintext = await readFile(entry.plain, "utf8");
      const payload = await encryptText(
        plaintext,
        password,
        entry.title || entry.plain
      );
      await writeJsonFile(entry.cipher, payload);
      console.log(`encrypted ${entry.plain} -> ${entry.cipher}`);
      continue;
    }

    const payload = await readJsonFile(entry.cipher);
    const plaintext = await decryptPayload(payload, password);
    await writeTextFile(entry.plain, plaintext);
    console.log(`decrypted ${entry.cipher} -> ${entry.plain}`);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  exit(1);
});
