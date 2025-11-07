import { DEFAULT_ABBREVIATIONS } from "./rules.js";
import { splitBySpans, type ProtectedSpan } from "./utils.js";

export interface DekevinifyOptions {
  abbreviations?: Record<string, string>;
  preserveEntities?: boolean;  // default true (urls/emails/@/#/numbers)
}

// Create reverse mapping from abbreviations to full words
function createReverseMap(abbrevMap: Record<string, string>): Record<string, string> {
  const reversed: Record<string, string> = {};
  for (const [full, abbrev] of Object.entries(abbrevMap)) {
    // For multi-word phrases, keep them
    reversed[abbrev] = full;
  }
  return reversed;
}

// Custom protected span finder for dekevinify - doesn't protect single-digit numbers
// since they might be abbreviations like "4" for "for" or "2" for "to"
function findProtectedSpansForDekevinify(input: string): ProtectedSpan[] {
  const spans: ProtectedSpan[] = [];
  
  // Only protect: URLs, emails, mentions, hashtags, and multi-digit numbers
  const urlRe = /\bhttps?:\/\/[^\s]+/gi;
  const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  const mentionRe = /(^|[\s])@[A-Za-z0-9_]+/g;
  const hashtagRe = /(^|[\s])#[A-Za-z0-9_]+/g;
  const numberRe = /\b\d{2,}(?:[.,]\d+)?\b/g; // Only protect 2+ digit numbers
  
  const add = (re: RegExp) => {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(input))) {
      const start = m.index;
      const end = start + m[0].length;
      spans.push({ start, end, text: m[0] });
    }
  };
  
  add(urlRe);
  add(emailRe);
  add(mentionRe);
  add(hashtagRe);
  add(numberRe);
  
  // merge overlaps
  spans.sort((a, b) => a.start - b.start);
  const merged: ProtectedSpan[] = [];
  for (const s of spans) {
    const last = merged[merged.length - 1];
    if (last && s.start <= last.end) {
      last.end = Math.max(last.end, s.end);
      last.text = input.slice(last.start, last.end);
    } else {
      merged.push({ ...s });
    }
  }
  
  return merged;
}

const WORD_RE = /w\/o|w\/|[&]|[A-Za-z0-9]+(?:'[A-Za-z]+)?/g;

function expandAbbreviation(token: string, reverseMap: Record<string, string>): string {
  const lower = token.toLowerCase();
  const expanded = reverseMap[lower];
  
  if (!expanded) return token;
  
  // Special cases for symbols and punctuation - return lowercase
  if (token === "&" || token === "w/" || token === "w/o") {
    return expanded;
  }
  
  // Check if token has any letters to determine case
  const hasLetters = /[a-zA-Z]/.test(token);
  if (!hasLetters) {
    // No letters (e.g., numbers like "4", "2") - return lowercase expanded form
    return expanded;
  }
  
  // Match case of original token for words with letters
  if (token === token.toUpperCase() && token.length > 1) {
    return expanded.toUpperCase();
  }
  if (token[0] === token[0].toUpperCase()) {
    return expanded[0].toUpperCase() + expanded.slice(1);
  }
  return expanded;
}

/**
 * Expands kevinified text back to more human-readable form
 * Note: This is lossy - stopwords and vowels cannot be fully restored
 */
export function dekevinify(input: string, opts: DekevinifyOptions = {}): string {
  const {
    abbreviations = DEFAULT_ABBREVIATIONS,
    preserveEntities = true
  } = opts;
  
  // Create reverse mapping
  const reverseMap = createReverseMap(abbreviations);
  
  // normalize whitespace
  let text = input.replace(/\s+/g, " ").trim();
  
  // find protected spans and split (using custom version that doesn't protect single digits)
  const spans = preserveEntities ? findProtectedSpansForDekevinify(text) : [];
  const parts = splitBySpans(text, spans);
  
  const process = (chunk: string) => {
    const out: string[] = [];
    let m: RegExpExecArray | null;
    WORD_RE.lastIndex = 0;
    
    while ((m = WORD_RE.exec(chunk))) {
      const token = m[0];
      const expanded = expandAbbreviation(token, reverseMap);
      out.push(expanded);
    }
    
    return out.join(" ");
  };
  
  const mapped = parts.map(p => typeof p === "string" ? process(p) : p.text);
  const joined = mapped.join(" ").replace(/\s+/g, " ").trim();
  
  return joined;
}

export default dekevinify;

