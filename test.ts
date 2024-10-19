import { publicEncrypt, constants } from "crypto";
import fs from "fs";

// Load your public key (ensure it's in PEM format)
const publicKeyPem = fs.readFileSync("rsa_public.pem", "utf8"); // Adjust path as necessary

// Function to encrypt a message using RSA OAEP
function encryptMessage(publicKeyPem: string, message: string) {
  // Convert the message to a Buffer
  const messageBuffer = Buffer.from(message, "utf8");

  // Encrypt the message using RSA with OAEP padding
  const encryptedMessage = publicEncrypt(
    {
      key: publicKeyPem,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      // Specify the hash function; SHA-256 is a common choice
      oaepHash: "sha1",
    },
    messageBuffer
  );

  // Return the encrypted message as a base64-encoded string
  return encryptedMessage.toString("base64");
}

// Example usage
const message = "Hello, World!";
const encryptedMessage = encryptMessage(publicKeyPem, message);
console.log("Encrypted Message:", encryptedMessage);
