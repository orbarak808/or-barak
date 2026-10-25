import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";

/** "OB" in Instrument Serif, cream on the site's near-black, square */
export async function monogram(px: number) {
  const fonts = await loadOgFonts();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#060506",
        color: "#EDE6D8",
        fontFamily: "Instrument Serif",
        fontSize: px * 0.62,
        lineHeight: 1,
        letterSpacing: "-0.02em",
        // Optical centring: the serif caps sit a touch high
        paddingTop: px * 0.04
      }}
    >
      OB
    </div>,
    { width: px, height: px, fonts: fonts.slice(0, 1) }
  );
}
