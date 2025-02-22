const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000; // Railway використовує PORT змінну

const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

app.use(express.static("public"));
app.use("/images", express.static(imagesDir));
app.use(express.json());

app.post("/api/screenshot", async (req, res) => {
  const { url, width, height, format, quality, fullPage } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: parseInt(width, 10) || 1920,
      height: parseInt(height, 10) || 1080,
    });

    await page.goto(url, { waitUntil: "networkidle2" });

    const screenshotPath = path.join(
      imagesDir,
      `screenshot_${uuidv4()}.${format || "png"}`
    );

    await page.screenshot({
      path: screenshotPath,
      type: format.toLowerCase() || "png",
      quality:
        format === "jpeg" || format === "webp"
          ? parseInt(quality, 10)
          : undefined,
      fullPage: fullPage || false,
    });

    await browser.close();

    res.json({
      message: "Screenshot successfully created!",
      url: `/images/${path.basename(screenshotPath)}`,
    });
  } catch (error) {
    console.error("Error generating screenshot:", error);
    res.status(500).json({ error: "Failed to generate screenshot." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
