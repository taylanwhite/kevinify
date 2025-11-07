export interface ProtectedSpan {
  start: number;
  end: number;
  text: string;
}

// crude but effective recognizers for tokens we should not mutate
const urlRe = /\bhttps?:\/\/[^\s]+/gi;
const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const mentionRe = /(^|[\s])@[A-Za-z0-9_]+/g;
const hashtagRe = /(^|[\s])#[A-Za-z0-9_]+/g;
const numberRe = /\b\d+(?:[.,]\d+)?\b/g;

export function findProtectedSpans(input: string): ProtectedSpan[] {
  const spans: ProtectedSpan[] = [];
  
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

export function splitBySpans(input: string, spans: ProtectedSpan[]): (string | ProtectedSpan)[] {
  const parts: (string | ProtectedSpan)[] = [];
  let idx = 0;
  
  for (const s of spans) {
    if (idx < s.start) parts.push(input.slice(idx, s.start));
    parts.push(s);
    idx = s.end;
  }
  
  if (idx < input.length) parts.push(input.slice(idx));
  return parts;
}


