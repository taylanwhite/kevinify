export type AbbrevMap = Record<string, string>;

export const DEFAULT_ABBREVIATIONS: AbbrevMap = {
  // pleasantries / common
  "please": "pls",
  "thanks": "thx",
  "thank you": "ty",
  "you're": "ur",
  "you are": "ur",
  "people": "ppl",
  "message": "msg",
  "between": "btwn",
  "before": "b4",
  "great": "gr8",
  "for": "4",          // optional but nice for compression
  "to": "2",           // ditto
  "and": "&",
  "with": "w/",
  "without": "w/o",
  "because": "cuz",
  "about": "abt",
  "really": "rly",
  "probably": "prob",
  "approximately": "approx",
  "information": "info",
  "documentation": "docs",
  "example": "ex",
  "questions": "qs",
  "application": "app",
  "administrator": "admin",
  "department": "dept",
  "management": "mgmt",
  "development": "dev",
  "production": "prod"
};

export const DEFAULT_STOPWORDS = new Set([
  "a","an","the",
  "just","really","very",
  "that","those","these",
  "some","any",
  "so","quite","rather",
  "actually","basically","literally",
  "like","kind","sort",
  "perhaps","maybe"
]);

// words you likely don't want to vowel-strip (acronyms or short tokens)
export const DEFAULT_PROTECTED = new Set([
  "llm","api","id","ui","ux","db","sql","nosql",
  "http","https","json","xml","yaml","csv"
]);


