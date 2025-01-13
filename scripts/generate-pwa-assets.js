import sharp from "sharp";
import { mkdir } from "fs/promises";
import { join } from "path";

const sizes = {
  "pwa-192x192.png": 192,
  "pwa-512x512.png": 512,
  "apple-touch-icon.png": 180,
  "favicon.ico": 32,
};

async function generatePWAIcons() {
  const publicDir = join(process.cwd(), "public");

  try {
    await mkdir(publicDir, { recursive: true });

    const sourceIcon = join(process.cwd(), "app", "assets", "icon.png");

    for (const [filename, size] of Object.entries(sizes)) {
      const outputPath = join(publicDir, filename);

      if (filename === "favicon.ico") {
        const tempPngPath = join(publicDir, "temp-favicon.png");
        await sharp(sourceIcon).resize(size, size).png().toFile(tempPngPath);

        await sharp(tempPngPath).toFile(outputPath.replace(".ico", ".png"));
      } else {
        await sharp(sourceIcon).resize(size, size).png().toFile(outputPath);
      }

      console.log(`Generated ${filename}`);
    }
  } catch (error) {
    console.error("Error generating PWA icons:", error);
    process.exit(1);
  }
}

generatePWAIcons();
