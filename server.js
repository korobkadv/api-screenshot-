const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
const port = 3000;

// Directory for storing screenshots
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(imagesDir));
app.use(express.json());

// Endpoint for generating a screenshot
app.post("/api/screenshot", async (req, res) => {
  const { url, width, height, format, quality, fullPage } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Configuring viewport
    await page.setViewport({
      width: parseInt(width, 10) || 1920,
      height: parseInt(height, 10) || 1080,
    });

    await page.goto(url, { waitUntil: "networkidle2" });

    // Generate a unique filename for the screenshot
    const screenshotPath = path.join(
      imagesDir,
      `screenshot_${uuidv4()}.${format || "png"}`
    );

    // Capture screenshot with user-defined settings
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

    // Sending response with the screenshot URL
    res.json({
      message: "Screenshot created successfully.",
      url: `/images/${path.basename(screenshotPath)}`,
    });
  } catch (error) {
    console.error("Error generating screenshot:", error);
    res.status(500).json({ error: "Failed to generate screenshot." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
