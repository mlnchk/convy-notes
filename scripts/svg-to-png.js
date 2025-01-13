import sharp from "sharp";
import { readFile } from "fs/promises";
import { join } from "path";

async function convertSvgToPng() {
  try {
    const svgBuffer = await readFile(
      join(process.cwd(), "app", "assets", "icon.svg"),
    );
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(join(process.cwd(), "app", "assets", "icon.png"));

    console.log("Successfully converted SVG to PNG");
  } catch (error) {
    console.error("Error converting SVG to PNG:", error);
    process.exit(1);
  }
}

convertSvgToPng();
