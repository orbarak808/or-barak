import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Static .woff files from @fontsource, read from disk: ImageResponse only
// takes ttf/otf/woff (next/font serves woff2), and nothing is fetched over
// the network at build time
const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

export async function loadOgFonts() {
  const [serif, sansSemibold] = await Promise.all([
    fontFile("instrument-serif", "instrument-serif-latin-400-normal.woff"),
    fontFile("instrument-sans", "instrument-sans-latin-600-normal.woff")
  ]);
  return [
    {
      name: "Instrument Serif",
      data: serif,
      weight: 400 as const,
      style: "normal" as const
    },
    {
      name: "Instrument Sans",
      data: sansSemibold,
      weight: 600 as const,
      style: "normal" as const
    }
  ];
}
