import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { webcrypto } from "node:crypto";

const subtle = webcrypto.subtle;

export async function loadEnv(path = ".env") {
  let content = "";

  try {
    content = await readFile(path, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export function getPassword() {
  const password = process.env.ENCRYPTION_PASSWORD;

  if (!password) {
    throw new Error("Missing ENCRYPTION_PASSWORD. Put it in .env or export it before running.");
  }

  return password;
}

export function toBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

export function fromBase64(value) {
  return Buffer.from(value, "base64");
}

async function deriveKey(password, salt, iterations, usages) {
  const passwordKey = await subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    usages
  );
}

export async function encryptText(plaintext, password, title) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const iterations = 310000;
  const key = await deriveKey(password, salt, iterations, ["encrypt"]);
  const ciphertext = await subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    new TextEncoder().encode(plaintext)
  );

  return {
    version: 1,
    title,
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ciphertext: toBase64(ciphertext)
  };
}

export async function decryptPayload(payload, password) {
  const key = await deriveKey(
    password,
    fromBase64(payload.salt),
    payload.iterations,
    ["decrypt"]
  );
  const plaintext = await subtle.decrypt(
    {
      name: "AES-GCM",
      iv: fromBase64(payload.iv)
    },
    key,
    fromBase64(payload.ciphertext)
  );

  return new TextDecoder().decode(plaintext);
}

export async function writeTextFile(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
}

export async function writeJsonFile(path, value) {
  await writeTextFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

export async function readJsonFile(path) {
  return JSON.parse(await readFile(path, "utf8"));
}
