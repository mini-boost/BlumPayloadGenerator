import fs from "fs";
import { generateKeyPairSync, publicEncrypt, constants } from "crypto";

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
});

const spkiPublicKey = publicKey.export({
  format: "der",
  type: "spki",
});

const pkcs8PrivateKey = privateKey.export({
  format: "der",
  type: "pkcs8",
});

// Convert DER to PEM format
const pemPublicKey = `-----BEGIN PUBLIC KEY-----\n${spkiPublicKey.toString(
  "base64"
)}\n-----END PUBLIC KEY-----`;

// Save the PEM public key to a file
fs.writeFileSync("rsa_public.pem", pemPublicKey);

console.log("Public key saved in PEM format as pubkey.pem");

// Convert DER to PEM format
const pemPrivateKey = `-----BEGIN RSA PRIVATE KEY-----\n${pkcs8PrivateKey.toString(
  "base64"
)}\n-----END RSA PRIVATE KEY-----`;

// Save the PEM public key to a file
fs.writeFileSync("rsa_private.pem", pemPrivateKey);

console.log("Public key saved in PEM format as pubkey.pem");

// // Log the keys to the console in base64 format for readability
// console.log("Public Key (SPKI):");
// console.log(spkiPublicKey.toString("base64")); // Convert to base64 for readability

// console.log("Private Key (PKCS#8):");
// console.log(pkcs8PrivateKey.toString("base64")); // Convert to base64 for readability
