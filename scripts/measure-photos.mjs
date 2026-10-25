// Writes width/height into src/lib/content/photography.ts for every Drive
// photo that doesn't have them yet. The justified gallery on /photography
// lays rows out from each photo's aspect ratio, so new photos need these.
//
//   node scripts/measure-photos.mjs
//
// Dimensions are read from the same Drive thumbnail rendition the site
// displays (sz=w2000): its aspect ratio is the original's, already rotated
// the way Drive shows it.
import fs from "node:fs";

const FILE = new URL("../src/lib/content/photography.ts", import.meta.url);
const SRC_LINE =
  /^(\s*)src: "https:\/\/drive\.google\.com\/uc\?export=view&id=([\w-]+)",$/;

// Width and height from a JPEG's start-of-frame marker or a PNG's IHDR
function imageSize(buf) {
  if (buf[0] === 0x89 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error("not a JPEG or PNG");
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) throw new Error("bad JPEG marker");
    const marker = buf[i + 1];
    const length = buf.readUInt16BE(i + 2);
    // SOF0-SOF15, excluding DHT (C4), JPG (C8) and DAC (CC)
    if (
      marker >= 0xc0 &&
      marker <= 0xcf &&
      ![0xc4, 0xc8, 0xcc].includes(marker)
    ) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + length;
  }
  throw new Error("no JPEG frame header");
}

const lines = fs.readFileSync(FILE, "utf8").split("\n");
const out = [];
let measured = 0;
for (let n = 0; n < lines.length; n++) {
  out.push(lines[n]);
  const match = lines[n].match(SRC_LINE);
  if (!match) continue;
  // Already measured: the next lines of the entry carry width/height
  if (/^\s*width:/.test(lines[n + 1] ?? "")) continue;
  const [, indent, id] = match;
  const url = `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${id}`);
  const { width, height } = imageSize(Buffer.from(await res.arrayBuffer()));
  out.push(`${indent}width: ${width},`, `${indent}height: ${height},`);
  measured++;
  console.log(`${id}  ${width} x ${height}`);
}
fs.writeFileSync(FILE, out.join("\n"));
console.log(`measured ${measured} photo(s)`);
