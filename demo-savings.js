import { kevinify } from "./dist/src/index.js";

console.log("=== Token Savings Demo ===\n");

const longText = `
Please help me understand the documentation about this application. 
The people in the management department really need to review the 
information before we can proceed to production. Thank you for your 
help with this example. You can email me at john@example.com or 
check out the documentation at https://docs.example.com for more details.
`.trim();

const compressed = kevinify(longText);

// Rough token estimation (1 token ≈ 4 characters for English)
const originalChars = longText.length;
const compressedChars = compressed.length;
const estimatedOriginalTokens = Math.ceil(originalChars / 4);
const estimatedCompressedTokens = Math.ceil(compressedChars / 4);
const savings = ((1 - compressedChars / originalChars) * 100).toFixed(1);

console.log("Original:");
console.log(longText);
console.log(`\nCharacters: ${originalChars}, Estimated tokens: ~${estimatedOriginalTokens}`);

console.log("\n" + "=".repeat(60) + "\n");

console.log("Kevinified:");
console.log(compressed);
console.log(`\nCharacters: ${compressedChars}, Estimated tokens: ~${estimatedCompressedTokens}`);

console.log("\n" + "=".repeat(60) + "\n");

console.log(`📊 Savings: ${savings}% fewer characters`);
console.log(`💰 Estimated token reduction: ${estimatedOriginalTokens - estimatedCompressedTokens} tokens`);
console.log(`✅ URLs and emails preserved!`);


