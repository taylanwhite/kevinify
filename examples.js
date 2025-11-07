import { kevinify } from "./dist/src/index.js";

console.log("=== Kevinify Examples ===\n");

const examples = [
  "Please send me the documentation about the new API features.",
  "Thank you for the really great information about this application.",
  "Why use many words when few words do the trick?",
  "Check out https://example.com and email me@example.com with questions.",
  "The people in the department need approximately 100 examples before production.",
  "I just really want to understand the management process without complexity."
];

examples.forEach((input, i) => {
  console.log(`Example ${i + 1}:`);
  console.log(`Input:  "${input}"`);
  console.log(`Output: "${kevinify(input)}"`);
  console.log();
});

// Test with options
console.log("=== With Options ===\n");

const optionsTest = "This is really a great example of the application.";
console.log(`Input: "${optionsTest}"\n`);

console.log(`Default:`);
console.log(`  "${kevinify(optionsTest)}"\n`);

console.log(`Keep stopwords (--keep-stopwords):`);
console.log(`  "${kevinify(optionsTest, { removeStopwords: false })}"\n`);

console.log(`No shortening (--no-shorten):`);
console.log(`  "${kevinify(optionsTest, { shortenLongWords: false })}"\n`);

console.log(`Keep case (--keep-case):`);
console.log(`  "${kevinify("Please Review The Documentation", { keepCase: true })}"\n`);


