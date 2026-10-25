import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

// The share image for every page: the hero portrait with the face on the
// right third, a dark gradient from the left, and the name and role on it
export const alt = "Or Barak, Filmmaker & Producer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The 2400x1349 portrait is drawn 1760px wide so the face (about 51% across
// the photo, 40% down) lands near 73% across and a little above centre,
// while the photo still covers the whole card
const PHOTO = { width: 1760, height: 989, left: -18, top: -113 };

export default async function OpenGraphImage() {
  const [photo, fonts] = await Promise.all([
    readFile(join(process.cwd(), "public/images/herophoto.jpg")),
    loadOgFonts()
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#060506"
      }}
    >
      <img
        src={photoSrc}
        alt=''
        width={PHOTO.width}
        height={PHOTO.height}
        style={{
          position: "absolute",
          left: PHOTO.left,
          top: PHOTO.top,
          width: PHOTO.width,
          height: PHOTO.height
        }}
      />
      <div
        style={{
          // Satori ignores inset; size the overlay explicitly
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          display: "flex",
          backgroundImage:
            "linear-gradient(to right, rgba(6,5,6,0.9) 0%, rgba(6,5,6,0.55) 30%, rgba(6,5,6,0) 60%)"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 72,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            fontFamily: "Instrument Serif",
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            color: "#EDE6D8"
          }}
        >
          Or Barak
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: "Instrument Sans",
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: "0.22em",
            color: "#D4AF37"
          }}
        >
          FILMMAKER &amp; PRODUCER
        </div>
      </div>
    </div>,
    { ...size, fonts }
  );
}
