import { kevinify, dekevinify } from "./dist/index.js";

console.log("=== Kevinify + Dekevinify Demo ===\n");

const examples = [
  "Please send me the documentation about the new API features.",
  "Thank you for the great information about this application.",
  "Check out https://example.com and email me@example.com with questions.",
  "I need approximately 100 examples before production.",
];

examples.forEach((original, i) => {
  const compressed = kevinify(original);
  const expanded = dekevinify(compressed);
  
  console.log(`Example ${i + 1}:`);
  console.log(`  Original:    "${original}"`);
  console.log(`  Kevinified:  "${compressed}"`);
  console.log(`  Dekevinified: "${expanded}"`);
  console.log();
});

console.log("=== Direct Dekevinify Tests ===\n");

const kevinified = [
  "pls send me docs",
  "ty 4 info abt app",
  "check out https://example.com & email me@example.com w/ qs",
  "ppl in dept need approx 100 exmpls b4 prod"
];

kevinified.forEach((text, i) => {
  console.log(`Test ${i + 1}:`);
  console.log(`  Input:  "${text}"`);
  console.log(`  Output: "${dekevinify(text)}"`);
  console.log();
});

console.log("=== Note ===");
console.log("⚠️  Dekevinify is lossy - it can't restore:");
console.log("   - Removed stopwords (a, the, just, etc.)");
console.log("   - Stripped vowels from long words");
console.log("   But it WILL expand common abbreviations back!");

