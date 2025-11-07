# kevinify

> Why use many word when few word do trick.

`kevinify` squeezes text for LLM prompts: abbreviates, drops filler, and shortens long words while preserving URLs/emails/@mentions/#hashtags and numbers.

## Install

```bash
npm i kevinify
# or
npm i -D kevinify
```

## Usage

### As a library

```typescript
import { kevinify, dekevinify } from "kevinify";

const input = "Please send me the documentation about the new API features.";
const compressed = kevinify(input);
// => "pls send me docs abt new api ftrs"

// Expand back to human-readable form
const expanded = dekevinify(compressed);
// => "please send me documentation about new api ftrs"

// With options
const output2 = kevinify(input, {
  removeStopwords: false,
  shortenLongWords: false,
  keepCase: true
});
```

### As a CLI

```bash
# Direct input
kevinify "Please help me understand this example"
# => "pls hlp me undrstnd ex"

# From stdin
echo "Thank you for the information" | kevinify
# => "ty 4 info"

# Preserve stopwords
kevinify --keep-stopwords "This is really great"
# => "ths is rly gr8"

# Keep original case
kevinify --keep-case "Please Review The Documentation"
# => "Pls Rvw Docs"

# Disable word shortening
kevinify --no-shorten "Please send information"
# => "pls send info"
```

## Features

- **Abbreviations**: Common words → short forms (`please` → `pls`, `people` → `ppl`, `for` → `4`)
- **Stopword removal**: Drops filler words like `the`, `a`, `just`, `really`
- **Vowel compression**: Long words → consonant-heavy (`information` → `informatn`)
- **Smart preservation**: URLs, emails, @mentions, #hashtags, and numbers stay intact
- **Reversible**: `dekevinify()` expands abbreviations back for human readability
- **Configurable**: Control every aspect via options

## Options

```typescript
interface KevinifyOptions {
  abbreviations?: Record<string, string>;  // Custom abbreviation map
  removeStopwords?: boolean;               // Remove filler words (default: true)
  shortenLongWords?: boolean;              // Compress long words (default: true)
  minLengthToShorten?: number;             // Min word length to compress (default: 6)
  keepCase?: boolean;                      // Preserve original case (default: false)
  preserveEntities?: boolean;              // Protect URLs/emails/@/# (default: true)
  aggressiveAmpersand?: boolean;           // Convert "and" → "&" (default: true)
  protectWords?: Set<string>;              // Additional words to never compress
}
```

## Examples

```typescript
// Basic compression
kevinify("Why use many words when few words do the trick?")
// => "why use many words when few words do trick"

// Preserving entities
kevinify("Check out https://example.com and email me@example.com")
// => "check out https://example.com & email me@example.com"

// Custom abbreviations
kevinify("Hello world", {
  abbreviations: { hello: "hi", world: "wrld" }
})
// => "hi wrld"

// Expand kevinified text back
dekevinify("pls send me docs 4 api")
// => "please send me documentation for api"

dekevinify("ty 4 info abt app")
// => "thank you for information about application"
```

## Dekevinify

The `dekevinify()` function reverses the compression to make text more human-readable:

```typescript
import { dekevinify } from "kevinify";

// Expands abbreviations back
const text = "pls send me docs abt api w/ examples b4 prod";
console.log(dekevinify(text));
// => "please send me documentation about api with examples before production"
```

**Note:** Dekevinify is lossy - it can't restore:
- Removed stopwords (`a`, `the`, `just`, etc.)
- Stripped vowels from long words
- But it WILL expand all common abbreviations!

```typescript
interface DekevinifyOptions {
  abbreviations?: Record<string, string>;  // Custom reverse abbreviations
  preserveEntities?: boolean;              // Protect URLs/emails/@/# (default: true)
}
```

## Why?

LLMs charge by token count. Shorter text = fewer tokens = lower costs. This library helps you:

- Reduce prompt size for LLM APIs
- Fit more context within token limits
- Lower API costs for high-volume applications

Inspired by Kevin Malone's philosophy: **"Why waste time say lot word when few word do trick?"**

## License

MIT


