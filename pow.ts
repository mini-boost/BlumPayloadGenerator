import { createHash } from "crypto";

/**
 * Function to generate a nonce and a corresponding hash for a given input string.
 * @param input - The input string
 * @param difficulty - The number of leading zeros required in the hash (difficulty level)
 * @returns {nonce, hash, iterations, timeTaken} - The generated nonce, the corresponding hash, total iterations, and time taken
 */
function generateNonceAndHash(
  input: string,
  difficulty: number
): { nonce: number; hash: string; iterations: number; timeTaken: number } {
  let nonce = 0;
  let hash = "";
  let iterations = 0;
  const target = "0".repeat(difficulty); // Define the target hash prefix (e.g., '0000')

  const startTime = Date.now(); // Start time for performance measurement

  while (true) {
    // Combine input and nonce
    const data = input + nonce;

    // Create the SHA-256 hash of the combined string
    hash = createHash("sha256").update(data).digest("hex");
    iterations++; // Count iterations

    // Check if the hash starts with the desired number of zeros (based on difficulty)
    if (hash.startsWith(target)) {
      break; // If it matches, break the loop
    }

    // Increment the nonce and try again
    nonce++;
  }

  const timeTaken = Date.now() - startTime; // Calculate time taken
  return { nonce, hash, iterations, timeTaken };
}

// Example usage:
const inputString = "ffb5c0d9-60a4-4f0e-869b-1695ba912203"; // Game ID
const difficultyLevel = 4; // Adjust the difficulty (e.g., 4 means hash starts with "0000")

const { nonce, hash, iterations, timeTaken } = generateNonceAndHash(
  inputString,
  difficultyLevel
);

console.log(`Id: ${inputString}`);
console.log(`Nonce: ${nonce}`);
console.log(`Hash: ${hash}`);
console.log(`Iterations: ${iterations}`);
console.log(`Time Taken: ${timeTaken} ms`);
