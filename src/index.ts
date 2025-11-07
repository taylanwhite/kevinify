import {
  DEFAULT_ABBREVIATIONS,
  DEFAULT_STOPWORDS,
  DEFAULT_PROTECTED
} from "./rules.js";
import { findProtectedSpans, splitBySpans } from "./utils.js";

export interface KevinifyOptions {
  abbreviations?: Record<string, string>;
  removeStopwords?: boolean;        // default true
  shortenLongWords?: boolean;       // default true
  minLengthToShorten?: number;      // default 6
  keepCase?: boolean;               // default false (lowercase)
  preserveEntities?: boolean;       // default true (urls/emails/@/#/numbers)
  aggressiveAmpersand?: boolean;    // turn "and" -> "&" even inside phrases (default true)
  protectWords?: Set<string>;       // additional protected lowercase words
}

const WORD_RE = /[A-Za-z]+(?:'[A-Za-z]+)?/g;

function applyAbbreviations(token: string, abbr: Record<string,string>): string {
  const lower = token.toLowerCase();
  // phrase-level would normally require multi-word parsing; this starter is per-token.
  return abbr[lower] ?? token;
}

function shouldDropStopword(token: string, removeStop: boolean): boolean {
  return removeStop && DEFAULT_STOPWORDS.has(token.toLowerCase());
}

function shortenWord(token: string, minLen: number, protect: Set<string>): string {
  const lower = token.toLowerCase();
  if (token.length < minLen) return token;
  if (protect.has(lower)) return token;
  
  // keep first char and strip inner vowels except last char if it becomes too short
  // e.g., "please" -> "plse", "information" -> "informatn"
  const chars = [...lower];
  const vowels = new Set(["a","e","i","o","u"]);
  const first = chars[0];
  const middle = chars.slice(1, -1).filter(c => !vowels.has(c));
  const last = chars[chars.length - 1];
  const compressed = [first, ...middle, last].join("");
  
  // avoid over-compressing to less than 3
  return compressed.length >= 3 ? matchCase(token, compressed) : token;
}

function matchCase(original: string, repl: string): string {
  // If original was Title/Upper, mirror it; otherwise return repl (lower) or original's case
  if (original === original.toUpperCase()) return repl.toUpperCase();
  if (original[0] === original[0].toUpperCase()) {
    return repl[0].toUpperCase() + repl.slice(1);
  }
  return repl;
}

export function kevinify(input: string, opts: KevinifyOptions = {}): string {
  const {
    abbreviations = DEFAULT_ABBREVIATIONS,
    removeStopwords = true,
    shortenLongWords = true,
    minLengthToShorten = 6,
    keepCase = false,
    preserveEntities = true,
    aggressiveAmpersand = true,
    protectWords = DEFAULT_PROTECTED
  } = opts;
  
  // normalize whitespace
  let text = input.replace(/\s+/g, " ").trim();
  
  // find protected spans and split
  const spans = preserveEntities ? findProtectedSpans(text) : [];
  const parts = splitBySpans(text, spans);
  
  const process = (chunk: string) => {
    let working = chunk;
    // basic punctuation spacing to help tokenization
    working = working.replace(/[.,;:!?()\[\]{}]+/g, " ");
    
    const out: string[] = [];
    let m: RegExpExecArray | null;
    WORD_RE.lastIndex = 0;
    
    while ((m = WORD_RE.exec(working))) {
      const token = m[0];
      const lowered = token.toLowerCase();
      
      if (aggressiveAmpersand && lowered === "and") {
        out.push("&");
        continue;
      }
      
      const abbr = applyAbbreviations(token, abbreviations);
      if (shouldDropStopword(abbr, removeStopwords)) continue;
      
      const maybeShort = shortenLongWords
        ? shortenWord(abbr, minLengthToShorten, protectWords)
        : abbr;
      
      out.push(keepCase ? maybeShort : maybeShort.toLowerCase());
    }
    
    return out.join(" ");
  };
  
  const mapped = parts.map(p => typeof p === "string" ? process(p) : p.text);
  const joined = mapped.join(" ").replace(/\s+/g, " ").trim();
  
  // tiny final polish: remove spaces before punctuation like " & "
  return joined.replace(/\s+&\s+/g, " & ");
}

export default kevinify;

