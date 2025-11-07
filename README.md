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
import { kevinify } from "kevinify";

const input = "Please send me the documentation about the new API features.";
const output = kevinify(input);
// => "pls snd me docs abt new api ftrs"

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

- **Abbreviations**: Common words → short forms (`please` → `pls`, `people` → `ppl`)
- **Stopword removal**: Drops filler words like `the`, `a`, `just`, `really`
- **Vowel compression**: Long words → consonant-heavy (`information` → `informatn`)
- **Smart preservation**: URLs, emails, @mentions, #hashtags, and numbers stay intact
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
// => "why use mny wrds whn fw wrds do trck"

// Preserving entities
kevinify("Check out https://example.com and email me@example.com")
// => "chck out https://example.com & eml me@example.com"

// Custom abbreviations
kevinify("Hello world", {
  abbreviations: { hello: "hi", world: "wrld" }
})
// => "hi wrld"
```

## Why?

LLMs charge by token count. Shorter text = fewer tokens = lower costs. This library helps you:

- Reduce prompt size for LLM APIs
- Fit more context within token limits
- Lower API costs for high-volume applications

Inspired by Kevin Malone's philosophy: **"Why waste time say lot word when few word do trick?"**

## License

MIT


