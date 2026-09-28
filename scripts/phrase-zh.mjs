// Chinese line-breaking pass. Run after editing any Chinese copy: npm run phrase:zh
// Inserts zero-width break points between BudouX phrases, keeps short labels whole,
// and glues punctuation to the next phrase in heading-length strings so no heading
// line ends on ， 、 ： or ；. Idempotent.

import { readFileSync, writeFileSync } from "node:fs";
import { loadDefaultSimplifiedChineseParser } from "budoux";

const parser = loadDefaultSimplifiedChineseParser();
const ZW = "​";
const WJ = "⁠";
const PUNCT = "，、：；";

// BudouX sometimes isolates one character (上 | 升). Join it to its neighbour so a
// line can never be left holding a single character.
function mergeSingles(segments) {
  const out = [];
  let carry = "";
  for (const seg of segments) {
    const piece = carry + seg;
    carry = "";
    if ([...piece].length === 1 && /[\u4e00-\u9fff]/.test(piece)) carry = piece;
    else out.push(piece);
  }
  if (carry) {
    if (out.length) out[out.length - 1] += carry;
    else out.push(carry);
  }
  return out;
}

function phrase(value) {
  const raw = value.replaceAll(ZW, "").replaceAll(WJ, "");
  if (!/[一-鿿]/.test(raw) || raw.includes(" — ") || raw.includes("\\u")) return raw;
  const visible = raw.replace(/\\n/g, "");
  // Very short labels stay whole.
  if (visible.length <= 4) return raw;
  const headingLike = visible.length <= 30 && !/[。！？]$/.test(visible);
  return raw
    .split("\\n")
    .map((line) => {
      let out = mergeSingles(parser.parse(line)).join(ZW);
      if (headingLike) {
        // Never end a heading line on punctuation: glue it to the following phrase.
        out = out.replace(new RegExp(`([${PUNCT}])${ZW}?`, "g"), `$1${WJ}`);
      }
      return out;
    })
    .join("\\n");
}

for (const file of process.argv.slice(2)) {
  let src = readFileSync(file, "utf8");
  let n = 0;
  src = src.replace(/"((?:[^"\\\n]|\\.)*)"/g, (whole, inner) => {
    if (!/[一-鿿]/.test(inner)) return whole;
    const next = phrase(inner);
    if (next !== inner) n++;
    return `"${next}"`;
  });
  writeFileSync(file, src);
  console.log(file.split("/").pop(), n);
}
